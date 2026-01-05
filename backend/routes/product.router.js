const express = require('express');
const product = express.Router();
const {
    getAllProducts,
    getDeletedProducts,
    getProductById,
    createProduct,
    updateProduct,
    softDeleteProduct,
    restoreProduct,
    deleteProductPermanently,
    getProductsByType
} = require('../controllers/product.controller');

product.get('/', getAllProducts);

product.get('/trash', getDeletedProducts);

product.get('/by-type/:typeId', getProductsByType);

product.get('/:id', getProductById);

product.post('/', createProduct);

product.put('/:id', updateProduct);

product.delete('/soft-delete/:id', softDeleteProduct);

product.patch('/restore/:id', restoreProduct);

product.delete('/delete-permanently/:id', deleteProductPermanently);

module.exports = product;
