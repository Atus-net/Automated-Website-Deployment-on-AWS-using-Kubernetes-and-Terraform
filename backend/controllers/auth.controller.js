const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        const response = await authService.registerUser(name, email, password, phone);
        res.status(response.code).json({
            code: response.code,
            message: response.message,
            user: response.user
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server error", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await authService.loginUser(email, password);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server error", error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const response = await authService.logoutUser(req, res);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server error", error: error.message });
    }
};



exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const response = await authService.refreshToken(refreshToken);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server error", error: error.message });
    }
};
// dùng để test khi chưa có FE
// exports.googleCallback = async (req, res) => {
//     try {
//         const response = await authService.loginWithGoogle(req.user);
//         // Trả về thông tin user và token (nếu cần)
//         res.status(200).json({
//             code: 200,
//             message: "Login with Google success",
//             data: req.user,  // thông tin user Google
//         });
//     } catch (error) {
//         res.status(400).json({
//             code: 400,
//             message: "Login with Google failed",
//         });
//     }
// };

// Google Auth Callback
exports.googleCallback = async (req, res) => {
    try {
        const response = await authService.loginWithGoogle(req.user);
        req.session.user = response.data;
        res.redirect(`${process.env.CLIENT_URL}/`);
    } catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/login-failed`);
    }
};

// Handle Success
exports.googleLoginSuccess = async (req, res) => {
    if (!req.user) return res.status(401).json({ code: 401, message: 'Not Authorized' });

    return res.status(200).json({
        code: 200,
        message: 'Login with Google success',
        data: req.user,
    });
};

// Handle Failed
exports.googleLoginFailed = async (req, res) => {
    res.status(401).json({ code: 401, message: 'Login with Google failed' });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({ message: 'Đã gửi mail reset mật khẩu' });
}

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        const result = await authService.resetPassword(token, newPassword, confirmPassword);
        res.status(result.code).json({
            message: result.message,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi máy chủ',
            error: error.message,
        });
    }
};
