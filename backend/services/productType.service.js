const ProductType = require('../models/productType.model');
const Product = require('../models/product.model');

// Get all product types
const getAllProductTypesService = async () => {
    return await ProductType.find();
};

// Get product type by ID
const getProductTypeByIdService = async (id) => {
    return await ProductType.findById(id);
};

// Create a new product type
const createProductTypeService = async (productTypeData) => {
    const { typeName, description } = productTypeData;

    // Check for duplicate product type name
    const existingType = await ProductType.findOne({ typeName });
    if (existingType) throw new Error('Product type already exists');

    const newProductType = new ProductType({ typeName, description });
    await newProductType.save();

    return newProductType;
};

// Update product type
const updateProductTypeService = async (id, productTypeData) => {
    const { typeName, description } = productTypeData;

    const existingProductType = await ProductType.findById(id);
    if (!existingProductType) throw new Error('Product type not found');

    if (typeName && typeName !== existingProductType.typeName) {
        const duplicateType = await ProductType.findOne({ typeName });
        if (duplicateType) throw new Error('Product type name already exists');
    }

    existingProductType.typeName = typeName || existingProductType.typeName;
    existingProductType.description = description || existingProductType.description;

    await existingProductType.save();
    return existingProductType;
};

// Delete product type
const deleteProductTypeService = async (id) => {
    const productExists = await Product.exists({ productType: id });

    if (productExists) throw new Error("Cannot delete! There are products linked to this type.");

    await ProductType.findByIdAndDelete(id);
};

module.exports = {
    getAllProductTypesService,
    getProductTypeByIdService,
    createProductTypeService,
    updateProductTypeService,
    deleteProductTypeService
};
