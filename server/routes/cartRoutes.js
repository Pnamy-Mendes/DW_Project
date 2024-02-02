// routes/cartRoutes.js
const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

// Get user's cart
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// Add to cart
router.post('/', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [productId] });
        } else {
            cart.products.push(productId);
        }
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
});

// Remove from cart
router.delete('/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;
    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            cart.products.pull(productId); // Mongoose method to remove an item from an array
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
});

module.exports = router;
