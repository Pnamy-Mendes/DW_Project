const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageName: { type: String },
    description: { type: String },
    // Remove the category field if it's no longer needed
    subSubCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Reference to sub-subcategories
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    /* rating: { type: Number }, */
    inventoryStatus: { type: String }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;