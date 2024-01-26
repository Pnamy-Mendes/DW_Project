const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageName: { type: String },
    description: { type: String },
    category: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    rating: { type: Number },
    inventoryStatus: { type: String }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
