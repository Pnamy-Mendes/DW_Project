// routes/cartRoutes.js
const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

// Get user's cart
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
                               .populate('products'); // Populate the 'products' field with actual product documents from the 'Product' collection
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});


// Inside POST /api/cart route
router.post('/', async (req, res) => { 
    const { userId, productId } = req.body;
    console.log("Adding to cart:", { userId, productId });  // Log incoming data

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [productId] });
        } else {
            cart.products.push(productId);
        }
        await cart.save();
        console.log("Cart updated successfully");  // Success logging
        res.status(201).json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);  // Error logging
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


// Express route to clear the cart for a given user
router.delete('/clear/:userId', async (req, res) => {
    const { userId } = req.params; // Correctly extracting the userId from the request parameters

    try {
        const cart = await Cart.findOne({ userId: userId });
        if (cart) {
            cart.products = []; // Clear the products array
            await cart.save();
            res.json({ message: 'Cart cleared successfully' });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Error clearing cart', error: error.toString() });
    }
});

module.exports = router;
