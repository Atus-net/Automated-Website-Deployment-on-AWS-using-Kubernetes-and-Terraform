const express = require('express');
const productType = express.Router();
const {
    getAllProductTypes,
    getProductTypeById,
    createProductType,
    updateProductType,
    deleteProductType
} = require('../controllers/productType.controller');

productType.get('/', getAllProductTypes);
productType.get('/:id', getProductTypeById);
productType.post('/', createProductType);
productType.put('/:id', updateProductType);
productType.delete('/:id', deleteProductType);

module.exports = productType;
