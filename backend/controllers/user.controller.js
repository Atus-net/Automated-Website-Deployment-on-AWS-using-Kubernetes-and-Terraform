const userService = require('../services/user.service');

// Get all users (Only Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            code: 200,
            message: "Successfully fetched user list!",
            data: users
        });
    } catch (error) {
        console.error("Error fetching user list:", error);
        res.status(500).json({
            code: 500,
            message: "Server error!",
            data: error.message
        });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const response = await userService.getCurrentUser(req.user.id);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server error", error: error.message });
    }
};

// Get user information by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({
            code: 200,
            message: "Successfully fetched user info!",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Server error!",
            data: error.message
        });
    }
};

// Update user information (User or Admin)
exports.updateUser = async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        const updatedUser = await userService.updateUser(req.params.id, { name, phone, email });
        res.status(200).json({
            code: 200,
            message: "User updated successfully!",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Server error!",
            data: error.message
        });
    }
};
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.id;

        const response = await userService.updatePassword(userId, currentPassword, newPassword, confirmPassword);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: "Internal server error", error: error.message });
    }
};

// Soft delete user (Only Admin)
exports.softDeleteUser = async (req, res) => {
    try {
        const user = await userService.softDeleteUser(req.params.id);
        res.status(200).json({
            code: 200,
            message: "User soft deleted!",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Server error!",
            data: error.message
        });
    }
};

// Restore soft deleted user (Only Admin)
exports.restoreUser = async (req, res) => {
    try {
        const user = await userService.restoreUser(req.params.id);
        res.status(200).json({
            code: 200,
            message: "User restored successfully!",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Server error!",
            data: error.message
        });
    }
};

// Permanently delete user (Only Admin)
exports.deleteUserPermanently = async (req, res) => {
    try {
        await userService.deleteUserPermanently(req.params.id);
        res.status(200).json({
            code: 200,
            message: "User permanently deleted!",
            data: null
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Server error!",
            data: error.message
        });
    }
};

exports.toggleUserActive = async (req, res) => {
    try {
        const { isActive } = req.body;
        const userId = req.params.id;

        const updated = await userService.toggleUserActive(userId, isActive);

        res.status(200).json({
            code: 200,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: updated,
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

exports.updateUserRoleWithAuth = async (req, res) => {
    try {
        const { adminPassword, isAdmin } = req.body;
        const targetUserId = req.params.id;
        const adminId = req.user.id;

        const updatedUser = await userService.updateUserRoleWithAuth({
            adminId,
            adminPassword,
            targetUserId,
            isAdmin
        });

        return res.status(200).json({
            code: 200,
            message: 'Cập nhật quyền người dùng thành công',
            data: updatedUser,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            code: error.statusCode || 500,
            message: error.message || 'Lỗi server khi cập nhật quyền người dùng',
        });
    }
};