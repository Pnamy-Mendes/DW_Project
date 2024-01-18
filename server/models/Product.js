const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    imageName: String,
    promoDetails: String,
    decription: String,
    // Add other fields as necessary
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
