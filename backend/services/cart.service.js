const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const addToCart = async (userId, productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity }]
        });
    } else {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
    }

    const cartWithProductInfo = await Cart.findById(cart._id)
        .populate('items.product', 'productName imageLink price');

    return {
        code: 200,
        message: 'Add to cart successfully',
        data: cartWithProductInfo
    };
};

const getCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
        throw new Error('Cart not found');
    }
    return {
        code: 200,
        message: 'Get cart successfully',
        data: cart
    };
};

const updateCartItem = async (userId, productId, quantity) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) throw new Error('Product not found in cart');

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return {
        code: 200,
        message: 'Update cart successfully',
        data: cart
    };
};

const deleteCartItem = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    return {
        code: 200,
        message: 'Delete item successfully',
        data: cart
    };
};

const deleteManyCartItem = async (userId, productIds) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new Error('Cart not found');
    }

    // Đảm bảo productIds là mảng các string
    const productIdsStr = productIds.map(id => id.toString());

    // Filter lại items không chứa productId nằm trong productIds
    cart.items = cart.items.filter(item => !productIdsStr.includes(item.product.toString()));

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'productName imageLink price');

    return {
        code: 200,
        message: 'Xóa thành công',
        data: updatedCart
    };
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    deleteCartItem,
    deleteManyCartItem
};
