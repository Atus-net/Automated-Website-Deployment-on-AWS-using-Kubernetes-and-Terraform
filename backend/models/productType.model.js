const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    typeName: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.models.ProductType || mongoose.model('ProductType', productTypeSchema, 'productType');
