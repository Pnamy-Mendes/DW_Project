
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    address: { type: String, required: true },
    purchasedAt: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
