const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Cart = require("../models/cart.model");
const sendMail = require('../utils/sendMail');

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
};

const generateAvatar = (name) => {
    const initials = name.split(" ").map(word => word[0]).join("").toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
};

exports.registerUser = async (name, email, password, phone, address) => {
    try {
        const avatar = generateAvatar(name);

        let user = await User.findOne({ email });
        if (user) {
            return { code: 400, message: "Email already exists!" };
        }

        user = await User.create({
            name,
            email,
            password,
            phone,
            address,
            avatar,
        });
        await Cart.create({
            user: user._id,
            items: [],
        });


        return { code: 201, message: "User registered successfully!", user: { avatar: user.avatar } };
    } catch (error) {
        return { code: 500, message: "Server error", error: error.message };
    }
};

exports.loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { code: 400, message: "Email does not exist!" };
        }

        if (!user.isActive) {
            return { code: 403, message: "Tài khoản của bạn đã bị khóa" };
        }

        if (user.isDeleted) {
            return { code: 400, message: "Account has been deleted!" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { code: 400, message: "Invalid password!" };
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return {
            code: 200,
            message: "Login successfully!",
            accessToken,
            refreshToken,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
                isActive: user.isActive,
                phone: user.phone,
            }
        };
    } catch (error) {
        console.error(error);
        return { code: 500, message: "Internal server error!" };
    }
};


exports.logoutUser = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            req.logout((err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
        });

        return { code: 200, message: 'Logout successful' };
    } catch (error) {
        console.error('Logout service error:', error);
        return res.status(500).json({ code: 500, message: 'Logout failed', error: error.message });
    }
};



exports.refreshToken = async (refreshToken) => {
    try {
        if (!refreshToken) return { code: 401, message: "Refresh Token is required!" };

        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
                if (err) {
                    return resolve({ code: 403, message: "Invalid Refresh Token!" });
                }

                const newAccessToken = generateAccessToken(user);
                resolve({
                    code: 200,
                    message: "New access token generated successfully!",
                    accessToken: newAccessToken,
                });
            });
        });
    } catch (error) {
        throw new Error("Server error");
    }
};

exports.loginWithGoogle = async (profile) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                avatar: profile.photos[0].value,
            });
        }

        return {
            code: 200,
            message: 'Login with Google successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isAdmin: user.isAdmin
            }
        };
    } catch (error) {
        return { code: 500, message: 'Internal server error', error: error.message };
    }
};

exports.forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email không tồn tại');

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token & expire to user
    user.resetPasswordToken = hashToken;
    user.resetPasswordExpire = Date.now() + process.env.RESET_PASSWORD_EXPIRE * 60 * 1000; // 15 phút
    await user.save();

    // Create reset password URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // HTML content
    const html = `
  <div style="
      max-width: 500px;
      margin: 0 auto;
      padding: 30px;
      background-color: #ffffff;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      font-family: Arial, sans-serif;
      color: #333;
      text-align: center;
  ">
    <h2 style="color: #664545;">Đặt lại mật khẩu DolciLuxe</h2>
    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
    <p>Nhấn vào nút bên dưới để tiếp tục:</p>
    <a href="${resetURL}" target="_blank" style="
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background-color: #664545;
        color: white;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
    ">
      Đặt lại mật khẩu
    </a>
    <p style="margin-top: 30px; font-size: 14px; color: #777;">
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
    </p>
    <p style="margin-top: 5px; font-size: 14px; color: #777;">
      Trân trọng,<br>DolciLuxe Team
    </p>
  </div>
`;

    // Send mail
    await sendMail(user.email, 'Reset mật khẩu DolciLuxe', html);
}

exports.resetPassword = async (token, newPassword, confirmPassword) => {
    if (!token || !newPassword || !confirmPassword) {
        return { code: 400, message: 'Vui lòng điền đầy đủ thông tin.' };
    }

    if (newPassword !== confirmPassword) {
        return { code: 400, message: 'Mật khẩu xác nhận không khớp.' };
    }

    // Hash lại token để so sánh
    const hashToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return { code: 400, message: 'Token không hợp lệ hoặc đã hết hạn.' };
    }

    user.password = newPassword
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return { code: 200, message: 'Mật khẩu đã được cập nhật thành công.' };
};