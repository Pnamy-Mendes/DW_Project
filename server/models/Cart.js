// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // This references the Product model
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
