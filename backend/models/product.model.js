const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String },
    imageLink: { type: String },
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        required: true
    },
    quantity: { type: Number, default: 100 },
    price: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
