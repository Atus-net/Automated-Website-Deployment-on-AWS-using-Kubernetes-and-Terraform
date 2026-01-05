const productTypeService = require('../services/productType.service');

const getAllProductTypes = async (req, res) => {
    try {
        const productTypes = await productTypeService.getAllProductTypesService();
        res.status(200).json(productTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductTypeById = async (req, res) => {
    try {
        const productType = await productTypeService.getProductTypeByIdService(req.params.id);
        if (!productType) return res.status(404).json({ message: 'Product type not found' });
        res.status(200).json(productType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProductType = async (req, res) => {
    try {
        const newProductType = await productTypeService.createProductTypeService(req.body);
        res.status(201).json(newProductType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProductType = async (req, res) => {
    try {
        const updatedProductType = await productTypeService.updateProductTypeService(req.params.id, req.body);
        res.status(200).json(updatedProductType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProductType = async (req, res) => {
    try {
        await productTypeService.deleteProductTypeService(req.params.id);
        res.status(200).json({ message: 'Product type deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProductTypes,
    getProductTypeById,
    createProductType,
    updateProductType,
    deleteProductType
};
