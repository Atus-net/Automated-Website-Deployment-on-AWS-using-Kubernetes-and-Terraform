const cartService = require('../services/cart.service');

const addToCart = async (req, res) => {
    try {
        const result = await cartService.addToCart(req.user.id, req.body.productId, req.body.quantity || 1);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const result = await cartService.getCart(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const result = await cartService.updateCartItem(req.user.id, req.body.productId, req.body.quantity);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const result = await cartService.deleteCartItem(req.user.id, req.params.productId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteManyCartItem = async (req, res) => {
    try {
        const { productIds } = req.body;

        const result = await cartService.deleteManyCartItem(req.user.id, productIds);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    deleteCartItem,
    deleteManyCartItem
};
