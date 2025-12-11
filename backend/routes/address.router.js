const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.verifyToken);

router.post('/', addressController.createAddress);
router.get('/', addressController.getAllAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
