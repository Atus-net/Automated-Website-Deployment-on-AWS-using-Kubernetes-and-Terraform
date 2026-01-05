const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/create-payment-url', verifyToken, paymentController.createPaymentUrl);
router.get('/payment-return', paymentController.vnpayReturn);
router.get('/vnpay-ipn', paymentController.vnpayIpnHandler)

module.exports = router;