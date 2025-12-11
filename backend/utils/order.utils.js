const Order = require('../models/order.model')

const updateOrderStatus = async (orderId, updateData) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    // Cập nhật trạng thái đơn hàng
    if (updateData.orderStatus) order.orderStatus = updateData.orderStatus;
    if (updateData.paymentStatus) order.paymentStatus = updateData.paymentStatus;
    if (updateData.paymentMethod) order.paymentMethod = updateData.paymentMethod;

    // Cập nhật kết quả thanh toán từ VNPAY
    if (updateData.paymentResult) {
        order.paymentResult = {
            vnp_TransactionNo: updateData.paymentResult.vnp_TransactionNo,
            vnp_BankCode: updateData.paymentResult.vnp_BankCode,
            vnp_PayDate: updateData.paymentResult.vnp_PayDate,
            vnp_ResponseCode: updateData.paymentResult.vnp_ResponseCode,
            vnp_Amount: updateData.paymentResult.vnp_Amount,
        };
    }

    await order.save();

    return {
        code: 200,
        message: 'Order updated successfully',
        data: order,
    };
};

module.exports = { updateOrderStatus }