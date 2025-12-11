const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const { getAllUsers,
    getUserById,
    updateUser,
    softDeleteUser,
    restoreUser,
    deleteUserPermanently,
    updatePassword,
    getCurrentUser,
    toggleUserActive,
    updateUserRoleWithAuth
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/', verifyAdmin, getAllUsers);  // Chỉ Admin được xem danh sách users
router.get('/current-user', verifyToken, getCurrentUser)
router.put('/current-user/update-password', verifyToken, updatePassword);
router.patch('/restore/:id', verifyAdmin, restoreUser);  // Admin khôi phục user
router.delete('/permanent/:id', verifyAdmin, deleteUserPermanently);  // Admin xóa vĩnh viễn user
router.patch('/toggle-active/:id', verifyToken, verifyAdmin, toggleUserActive);
router.patch('/role/:id', verifyToken, verifyAdmin, updateUserRoleWithAuth)
router.get('/:id', verifyAdmin, getUserById);  // User nào cũng xem profile của họ được
router.put('/:id', verifyToken, updateUser); // Cập nhật user
router.delete('/:id', verifyAdmin, softDeleteUser);  // Admin xóa mềm user

module.exports = router;
