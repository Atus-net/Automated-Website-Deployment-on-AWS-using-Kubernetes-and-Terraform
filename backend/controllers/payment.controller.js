const paymentService = require('../services/payment.service');
const { sendOrderConfirmationEmail } = require('../utils/sendOrderConfirmationEmail');

const createPaymentUrl = async (req, res) => {
    const { orderId } = req.body;
    const userId = req.user.id;

    const paymentUrl = await paymentService.createPaymentUrl(orderId, userId);

    res.status(200).json({
        paymentUrl
    });
};
const vnpayReturn = async (req, res) => {
    try {
        const result = await paymentService.handleReturn(req.query);

        if (result.success) {
            await sendOrderConfirmationEmail(result.orderId, result.transactionId);
            return res.status(200).json({
                success: true,
                message: 'Payment successful',
                data: {
                    orderId: result.orderId,
                    transactionId: result.transactionId,
                    amount: result.amount,
                    paymentMethod: 'VNPAY',
                    payDate: result.payDate,
                },
                meta: {
                    returnUrl: `${process.env.CLIENT_URL}/payment-success?orderId=${result.orderId}`,
                    // signature: generateSignature(result.orderId, result.vnp_Amount),
                    // clientNote: 'Vui lòng không chia sẻ thông tin thanh toán'
                }

            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Payment failed',
                data: null,
                meta: {
                    returnUrl: `${process.env.CLIENT_URL}/payment-fail`,
                    // signature: generateSignature(result.orderId, result.vnp_Amount),
                    // clientNote: 'Vui lòng không chia sẻ thông tin thanh toán'
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null,
            meta: {
                returnUrl: `${process.env.CLIENT_URL}/payment-fail`,
                // signature: generateSignature(result.orderId, result.vnp_Amount),
                // clientNote: 'Vui lòng không chia sẻ thông tin thanh toán'
            }
        })
    }
};

const vnpayIpnHandler = async (req, res) => {
    try {
        const result = await paymentService.handleVnpIpn(req.query);

        return res.status(200).json(result);
    } catch (error) {
        console.error('VNPAY IPN Error:', error);
        return res.status(500).json({ RspCode: '99', Message: 'Internal Server Error' });
    }
};

module.exports = {
    createPaymentUrl, vnpayReturn, vnpayIpnHandler
};
