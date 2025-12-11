const Product = require('../models/product.model');
const ProductType = require('../models/productType.model');

// Get all products
const getAllProductsService = async () => {
    return await Product.find({ isDeleted: false })
        .populate({ path: 'productType', select: '_id typeName' });
};

// Get all deleted products
const getDeletedProductsService = async () => {
    return await Product.find({ isDeleted: true })
        .populate({ path: 'productType', select: '_id typeName' });
};

// Get a product by ID
const getProductByIdService = async (id) => {
    return await Product.findById(id)
        .populate({ path: 'productType', select: '_id typeName' });
};

// Get products by product type
const getProductsByTypeService = async (typeId) => {
    return await Product.find({ productType: typeId, isDeleted: false })
        .populate({ path: 'productType', select: '_id typeName' });
};

// Create a new product
const createProductService = async (productData) => {
    const { productName, description, imageLink, productType, quantity, price } = productData;
    const productTypeExists = await ProductType.findById(productType);
    if (!productTypeExists) throw new Error('ProductType not found');

    const newProduct = new Product({ productName, description, imageLink, productType, quantity, price });
    await newProduct.save();

    return await Product.findById(newProduct._id).populate({ path: 'productType', select: '_id typeName' });
};

// Update a product
const updateProductService = async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, { new: true })
        .populate({ path: 'productType', select: '_id typeName' });
};

// Soft delete a product
const softDeleteProductService = async (id) => {
    return await Product.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
};

// Restore a soft deleted product
const restoreProductService = async (id) => {
    return await Product.findByIdAndUpdate(id, { isDeleted: false, deletedAt: null }, { new: true });
};

// Permanently delete a product
const deleteProductPermanentlyService = async (id) => {
    const product = await Product.findById(id);
    if (!product.isDeleted) throw new Error('Product must be soft deleted before permanent deletion');

    await Product.findByIdAndDelete(id);
};

module.exports = {
    getAllProductsService,
    getDeletedProductsService,
    getProductByIdService,
    getProductsByTypeService,
    createProductService,
    updateProductService,
    softDeleteProductService,
    restoreProductService,
    deleteProductPermanentlyService
};
