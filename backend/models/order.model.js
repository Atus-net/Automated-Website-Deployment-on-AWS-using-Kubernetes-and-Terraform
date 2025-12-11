const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true }, // Shipping Address
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'VNPAY'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'processing', 'shipping', 'completed', 'cancelled'], default: 'pending' },
    paymentResult: {
        vnp_TransactionNo: { type: String },
        vnp_BankCode: { type: String },
        vnp_PayDate: { type: String },
        vnp_ResponseCode: { type: String },
        vnp_Amount: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
