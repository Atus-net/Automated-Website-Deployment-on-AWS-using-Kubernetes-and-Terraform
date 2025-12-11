const passport = require('passport');
const User = require('../models/user.model');

exports.getAllUsers = async () => {
    try {
        const users = await User.find({ isDeleted: false }).select('-password');
        return users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || null,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    } catch (error) {
        throw new Error('Error fetching user list: ' + error.message);
    }
};

exports.getCurrentUser = async (userId) => {
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return { code: 404, message: "User not found" };
        }

        return {
            code: 200,
            message: "Get current user successfully",
            data: user
        };
    } catch (error) {
        return { code: 500, message: "Internal server error", error: error.message };
    }
};

exports.getUserById = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');
        if (!user || user.isDeleted) {
            throw new Error("User not found!");
        }
        return user;
    } catch (error) {
        throw new Error('Error fetching user info: ' + error.message);
    }
};

exports.updatePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        return { code: 400, message: 'Vui lòng điền đầy đủ thông tin.' };
    }

    if (newPassword !== confirmPassword) {
        return { code: 400, message: 'Mật khẩu xác nhận không khớp.' };
    }

    const user = await User.findById(userId);
    if (!user) {
        return { code: 404, message: 'Không tìm thấy người dùng.' };
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return { code: 401, message: 'Mật khẩu hiện tại không đúng.' };
    }

    user.password = newPassword; // middleware sẽ tự hash
    await user.save();

    return { code: 200, message: 'Cập nhật mật khẩu thành công.' };
};

exports.updateUser = async (userId, updateData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { ...updateData, updatedAt: Date.now() },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            throw new Error("User not found!");
        }

        return updatedUser;
    } catch (error) {
        throw new Error('Error updating user info: ' + error.message);
    }
};

exports.softDeleteUser = async (userId) => {
    try {
        const user = await User.findByIdAndUpdate(userId, { isDeleted: true, deletedAt: Date.now() }, { new: true });
        if (!user) {
            throw new Error("User not found!");
        }

        return user;
    } catch (error) {
        throw new Error('Error performing soft delete: ' + error.message);
    }
};

exports.restoreUser = async (userId) => {
    try {
        const user = await User.findByIdAndUpdate(userId, { isDeleted: false, deletedAt: null }, { new: true });
        if (!user) {
            throw new Error("User not found!");
        }

        return user;
    } catch (error) {
        throw new Error('Error restoring user: ' + error.message);
    }
};

exports.deleteUserPermanently = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error("User not found!");
        }

        return true;
    } catch (error) {
        throw new Error('Error permanently deleting user: ' + error.message);
    }
};

exports.toggleUserActive = async (userId, isActive) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive, updatedAt: Date.now() },
        { new: true }
    ).select('-password');

    if (!user) throw new Error('User not found');
    return user;
};

exports.updateUserRoleWithAuth = async ({ adminId, adminPassword, targetUserId, isAdmin }) => {
    const admin = await User.findById(adminId);
    if (!admin) {
        const err = new Error('Admin không tồn tại');
        err.statusCode = 401;
        throw err;
    }

    const isMatch = await admin.comparePassword(adminPassword);
    if (!isMatch) {
        const err = new Error('Mật khẩu không chính xác');
        err.statusCode = 401;
        throw err;
    }

    if (adminId.toString() === targetUserId) {
        const err = new Error('Không thể thay đổi quyền của chính bạn');
        err.statusCode = 400;
        throw err;
    }

    const updatedUser = await User.findByIdAndUpdate(
        targetUserId,
        { isAdmin, updatedAt: Date.now() },
        { new: true }
    ).select('-password');

    if (!updatedUser) {
        const err = new Error('Người dùng không tồn tại');
        err.statusCode = 404;
        throw err;
    }

    return updatedUser;
};