const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product'); // Ensure the path is correct
const Category = require('../models/Category'); // Ensure the path is correct   

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Save files in 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
    }
});

const upload = multer({ storage: storage });

// Route to handle file upload
router.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ imagePath: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).send('No file uploaded.');
    }
});


// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});

// Get a single product by id
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product', error: err.message });
    }
});


// Create a new product
router.post('/', async (req, res) => {
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error creating product', error: err.message });
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
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error updating product', error: err.message });
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
    } catch (err) {
        res.status(400).json({ message: 'Error deleting product', error: err.message });
    }
});

router.post('/apply-promotion', async (req, res) => {
    try {
      const { productIds, promotion } = req.body;
      const updatedProducts = await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { promotion: promotion } },
        { new: true }
      );
      res.json(updatedProducts);
    } catch (err) {
      res.status(500).json({ message: 'Error applying promotion', error: err.message });
    }
});

module.exports = router;