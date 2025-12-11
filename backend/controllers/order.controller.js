const orderService = require('../services/order.service');

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id; // hoặc req.userId nếu bạn gán vậy
        const { cartItemIds, addressId, paymentMethod } = req.body;

        const order = await orderService.createOrder(userId, { cartItemIds, addressId, paymentMethod });

        res.status(201).json({
            message: 'Create order successfully',
            data: order
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const createBuyNowOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, addressId, paymentMethod } = req.body;

        const order = await orderService.createBuyNowOrder(userId, {
            productId,
            quantity,
            addressId,
            paymentMethod
        });

        res.status(201).json({
            message: 'Buy Now order created successfully',
            data: order
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const result = await orderService.getOrders(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getOrderDetail = async (req, res) => {
    try {
        const result = await orderService.getOrderDetail(req.user.id, req.params.orderId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const result = await orderService.updateOrderStatus(req.params.orderId, req.body.status);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const result = await orderService.deleteOrder(req.params.orderId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    createBuyNowOrder,
    getOrders,
    getOrderDetail,
    updateOrderStatus,
    deleteOrder
};
