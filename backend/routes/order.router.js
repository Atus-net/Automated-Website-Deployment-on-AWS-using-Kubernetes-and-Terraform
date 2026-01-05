const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// User
router.post('/', verifyToken, orderController.createOrder);
router.post('/buy-now', verifyToken, orderController.createBuyNowOrder);
router.get('/', verifyToken, orderController.getOrders);
router.get('/:orderId', verifyToken, orderController.getOrderDetail);

// Admin
router.patch('/status/:orderId', verifyToken, verifyAdmin, orderController.updateOrderStatus);
router.delete('/:orderId', verifyToken, verifyAdmin, orderController.deleteOrder);

module.exports = router;
