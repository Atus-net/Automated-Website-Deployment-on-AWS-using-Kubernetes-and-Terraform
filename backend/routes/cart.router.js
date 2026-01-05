const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.verifyToken);

router.post('/', cartController.addToCart);

router.get('/', cartController.getCart);

router.put('/', cartController.updateCartItem);

router.delete('/delete-many', cartController.deleteManyCartItem);
router.delete('/:productId', cartController.deleteCartItem);

module.exports = router;
