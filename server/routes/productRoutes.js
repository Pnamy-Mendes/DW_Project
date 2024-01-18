const express = require('express');
const Product = require('../models/Product'); // Adjust path as needed
const router = express.Router();


// Create a new product
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error: error });
    }
});

// GET all products
router.get('/', async (req, res) => {
    try {
        let query = {};

        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.minPrice) {
            query.price = { $gte: req.query.minPrice };
        }
        if (req.query.maxPrice) {
            query.price = { ...query.price, $lte: req.query.maxPrice };
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// Update a product
router.put('/:productId', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error });
    }
});


// Delete a product
router.delete('/:productId', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting product', error });
    }
});


// Get all products with optional filters
router.get('/products', async (req, res) => {
    try {
        const query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        // Add other filters as needed

        let products = Product.find(query);

        // Sorting
        if (req.query.sortBy) {
            const sortParam = {}; // e.g., { price: 'asc' }
            sortParam[req.query.sortBy] = req.query.sortOrder || 'asc';
            products = products.sort(sortParam);
        }

        const results = await products;
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
