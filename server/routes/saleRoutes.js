// routes/saleRoutes.js
const express = require('express');
const Sale = require('../models/Sale');

const router = express.Router();

// Create a sale
router.post('/', async (req, res) => {
    const { userId, products, address } = req.body;
    try {
        const sale = new Sale({ userId, products, address });
        await sale.save();
        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Error creating sale', error: error.message });
    }
});

// Get sales by user
router.get('/:userId', async (req, res) => {
    try {
        const sales = await Sale.find({ userId: req.params.userId });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales', error: error.message });
    }
});

module.exports = router;
