const productService = require('../services/product.service');

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProductsService();
        res.status(200).json({ code: 200, message: 'Success', data: products });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message, data: null });
    }
};

const getDeletedProducts = async (req, res) => {
    try {
        const products = await productService.getDeletedProductsService();
        res.status(200).json({ code: 200, message: 'Success', data: products });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message, data: null });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductByIdService(req.params.id);
        if (!product) return res.status(404).json({ code: 404, message: 'Product not found', data: null });

        res.status(200).json({ code: 200, message: 'Success', data: product });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message, data: null });
    }
};

const getProductsByType = async (req, res) => {
    try {
        const { typeId } = req.params;
        const products = await productService.getProductsByTypeService(typeId);
        res.status(200).json({ code: 200, message: 'Success', data: products });
    } catch (error) {
        res.status(500).json({ code: 500, message: 'Internal server error', error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProductService(req.body);
        res.status(201).json({ code: 201, message: 'Product created successfully', data: newProduct });
    } catch (error) {
        res.status(500).json({ code: 500, message: 'Internal server error', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProductService(req.params.id, req.body);
        if (!updatedProduct) return res.status(404).json({ code: 404, message: 'Product not found', data: null });

        res.status(200).json({ code: 200, message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message, data: null });
    }
};

const softDeleteProduct = async (req, res) => {
    try {
        const product = await productService.softDeleteProductService(req.params.id);
        if (!product) return res.status(404).json({ code: 404, message: 'Product not found', data: null });

        res.status(200).json({ code: 200, message: 'Product moved to trash', data: product });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message, data: null });
    }
};

const restoreProduct = async (req, res) => {
    try {
        const product = await productService.restoreProductService(req.params.id);
        if (!product) return res.status(404).json({ code: 404, message: 'Product not found', data: null });

        res.status(200).json({ code: 200, message: 'Product restored successfully', data: product });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message, data: null });
    }
};

const deleteProductPermanently = async (req, res) => {
    try {
        await productService.deleteProductPermanentlyService(req.params.id);
        res.status(200).json({ code: 200, message: 'Product permanently deleted', data: null });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message, data: null });
    }
};

module.exports = {
    getAllProducts,
    getDeletedProducts,
    getProductById,
    getProductsByType,
    createProduct,
    updateProduct,
    softDeleteProduct,
    restoreProduct,
    deleteProductPermanently
};
