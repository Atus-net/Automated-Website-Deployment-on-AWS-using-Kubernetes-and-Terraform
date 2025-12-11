const express = require('express');
const router = express.Router();

const productRouter = require('./product.router');
const productTypeRouter = require('./productType.router');
const authRouter = require('./auth.router')
const userRouter = require('./user.router');
const addressRouter = require('./address.router');
const cartRouter = require('./cart.router')
const orderRouter = require('./order.router')
const paymentRouter = require('./payment.router')

router.use('/products', productRouter);
router.use('/product-types', productTypeRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/address', addressRouter);
router.use('/cart', cartRouter)
router.use('/orders', orderRouter)
router.use('/public/products', productRouter); 
router.use('/public/product', productRouter);
router.use('/payment', paymentRouter)

module.exports = router;
