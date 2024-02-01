const express = require('express');
const User = require('../models/User'); // Ensure the path is correct
const mongoose = require('mongoose');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Get a single user by ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    const userData = { ...req.body, lowercaseUsername: req.body.username.toLowerCase() };
    const user = new User(userData);

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: 'Error creating user', error: err.message });
    }
});

// Update a user
router.put('/:userId', async (req, res) => {
    const updateData = req.body; // Assuming req.body contains the fields to update

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            updateData,
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: 'Error updating user', error: err.message });
    }
});

// Delete a user
router.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting user', error: err.message });
    }
});

module.exports = router;
