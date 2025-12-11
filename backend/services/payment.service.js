const Order = require('../models/order.model');
const crypto = require('crypto');
const moment = require('moment');

const { vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl, vnp_IpnUrl } = require('../configs/vnpay.config');
const { updateOrderStatus } = require('../utils/order.utils')

const createPaymentUrl = async (orderId, userId) => {
    const order = await Order.findById(orderId);

    if (!order) throw new Error('Order not found');
    if (order.user.toString() !== userId) throw new Error('Not authorized');
    if (order.paymentMethod !== 'VNPAY') throw new Error('This order is not paid with VNPAY');

    const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: vnp_TmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: order._id.toString(),
        vnp_OrderInfo: `Thanh-toan-don-hang-${order._id}`,
        vnp_OrderType: 'other',
        vnp_Amount: order.totalPrice * 100,
        vnp_ReturnUrl: vnp_ReturnUrl,
        vnp_IpAddr: "127.0.0.1",
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
    };

    const redirectUrl = new URL(vnp_Url);

    // Sắp xếp và append vào URL
    Object.entries(vnp_Params)
        .sort(([key1], [key2]) => key1.localeCompare(key2))
        .forEach(([key, value]) => {
            if (value) {
                redirectUrl.searchParams.append(key, value.toString());
            }
        });

    // Tạo secure hash
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac
        .update(Buffer.from(redirectUrl.search.slice(1), 'utf-8'))
        .digest('hex');

    redirectUrl.searchParams.append('vnp_SecureHash', signed);

    return redirectUrl.toString();
};

const handleReturn = async (vnpParams) => {
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const sortedParams = sortObject(vnpParams);

    const signData = Object.entries(sortedParams)
        .map(([key, val]) => `${key}=${val}`)
        .join('&');

    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
        return { success: false, message: 'Invalid signature' };
    }

    const success = vnpParams['vnp_ResponseCode'] === '00' && vnpParams['vnp_TransactionStatus'] === '00';

    return {
        success,
        orderId: vnpParams['vnp_TxnRef'],
        transactionId: vnpParams['vnp_TransactionNo'],
        amount: Number(vnpParams['vnp_Amount']) / 100,
        bankCode: vnpParams['vnp_BankCode'],
        payDate: vnpParams['vnp_PayDate'],
        message: success ? 'Payment successful' : 'Payment failed'
    };
};

const handleVnpIpn = async (vnpParams) => {

    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const sortedParams = sortObject(vnpParams);

    const signData = Object.entries(sortedParams)
        .map(([key, val]) => `${key}=${val}`)
        .join('&');
    const secretKey = vnp_HashSecret;

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
        return { RspCode: '97', Message: 'Invalid signature' };
    }

    const orderId = vnpParams['vnp_TxnRef'];
    const responseCode = vnpParams['vnp_ResponseCode'];
    const transactionStatus = vnpParams['vnp_TransactionStatus'];

    if (responseCode === '00' && transactionStatus === '00') {
        const result = await updateOrderStatus(orderId, {
            orderStatus: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'VNPAY',
            paymentResult: {
                vnp_TransactionNo: vnpParams['vnp_TransactionNo'],
                vnp_BankCode: vnpParams['vnp_BankCode'],
                vnp_PayDate: vnpParams['vnp_PayDate'],
                vnp_ResponseCode: vnpParams['vnp_ResponseCode'],
                vnp_Amount: vnpParams['vnp_Amount']
            }
        });

        return { RspCode: '00', Message: 'Success' };
    }

    return { RspCode: '00', Message: 'Payment Failed' };
};

const sortObject = (obj) => {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        sorted[key] = obj[key];
    }
    return sorted;
};

module.exports = {
    createPaymentUrl, handleReturn, handleVnpIpn
};
