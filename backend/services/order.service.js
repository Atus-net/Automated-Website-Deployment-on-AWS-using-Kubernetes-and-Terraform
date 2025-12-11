const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Address = require('../models/address.model');
const paymentService = require('../services/payment.service')
const Product = require('../models/product.model');

const createOrder = async (userId, { cartItemIds, addressId, paymentMethod }) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) throw new Error('Cart not found');

    if (!cartItemIds || cartItemIds.length === 0) throw new Error('No item selected');

    const selectedItems = cart.items.filter(item => cartItemIds.includes(item._id.toString()));
    if (selectedItems.length === 0) throw new Error('Selected items not found in cart');

    const orderItems = selectedItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
    }));

    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const address = await Address.findById(addressId);
    if (!address) throw new Error('Address not found');

    const newOrder = await Order.create({
        user: userId,
        items: orderItems,
        address,
        paymentMethod,
        totalPrice,
        paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
        orderStatus: 'pending'
    });

    // Xoá item đã đặt khỏi cart
    cart.items = cart.items.filter(item => !cartItemIds.includes(item._id.toString()));
    await cart.save();

    if (paymentMethod === 'COD') {
        return {
            order: newOrder,
            paymentUrl: null
        };
    }

    if (paymentMethod === 'VNPAY') {
        const paymentUrl = await paymentService.createPaymentUrl(newOrder._id, userId);
        return {
            order: newOrder,
            paymentUrl
        }
    }
    throw new Error('Invalid payment method');
};

const createBuyNowOrder = async (userId, { productId, quantity, addressId, paymentMethod }) => {
    // 1. Kiểm tra sản phẩm
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    // if (product.stock < quantity) throw new Error('Insufficient stock');

    // 2. Kiểm tra địa chỉ
    const address = await Address.findById(addressId);
    if (!address) throw new Error('Address not found');

    // 3. Tạo order item
    const orderItem = {
        product: productId,
        quantity,
        price: product.price
    };

    // 4. Tính tổng tiền
    const totalPrice = product.price * quantity;

    // 5. Tạo đơn hàng
    const newOrder = await Order.create({
        user: userId,
        items: [orderItem],
        address,
        paymentMethod,
        totalPrice,
        paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
        orderStatus: 'pending',
        isBuyNow: true // Đánh dấu đơn hàng mua ngay
    });

    //  Cập nhật tồn kho (nếu cần)
    // product.stock -= quantity;
    // await product.save();

    // 7. Xử lý thanh toán
    if (paymentMethod === 'VNPAY') {
        const paymentUrl = await paymentService.createPaymentUrl(newOrder._id, userId);
        return {
            order: newOrder,
            paymentUrl
        };
    }

    return {
        order: newOrder,
        paymentUrl: null
    };
};
const getOrders = async (userId) => {
    const orders = await Order.find({ user: userId }).populate('items.product').populate('address');
    return { code: 200, message: 'Get orders successfully', data: orders };
};

const getOrderDetail = async (userId, orderId) => {
    const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product').populate('address');
    if (!order) throw new Error('Order not found');
    return { code: 200, message: 'Get order detail successfully', data: order };
};

const updateOrderStatus = async (orderId, status) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    order.orderStatus = status;
    await order.save();

    return { code: 200, message: 'Order status updated successfully', data: order };
};

const deleteOrder = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    await order.deleteOne();

    return { code: 200, message: 'Order deleted successfully' };
};

module.exports = {
    createOrder,
    createBuyNowOrder,
    getOrders,
    getOrderDetail,
    updateOrderStatus,
    deleteOrder
};
