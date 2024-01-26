const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    // Include other fields as needed
});

module.exports = mongoose.model('Category', categorySchema);
