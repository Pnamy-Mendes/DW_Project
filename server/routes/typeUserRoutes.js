const express = require('express');
const TypeUser = require('../models/TypeUser'); // Ensure the path is correct
const Permission = require('../models/Permission');
const router = express.Router();

// Get all TypeUsers with their permissions
router.get('/', async (req, res) => {
    try {
        const typeUsers = await TypeUser.find().populate('permissions');
        res.json(typeUsers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching TypeUsers', error: err.message });
    }
});

// Get a single TypeUser by ID
router.get('/:typeUserId', async (req, res) => {
    try {
        const typeUser = await TypeUser.findById(req.params.typeUserId).populate('permissions');
        if (!typeUser) return res.status(404).json({ message: 'TypeUser not found' });
        res.json(typeUser);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching TypeUser', error: err.message });
    }
});

// Create a new TypeUser
router.post('/', async (req, res) => {
    const typeUser = new TypeUser(req.body);

    try {
        const newTypeUser = await typeUser.save();
        res.status(201).json(newTypeUser);
    } catch (err) {
        res.status(400).json({ message: 'Error creating TypeUser', error: err.message });
    }
});

// Update a TypeUser
router.put('/:typeUserId', async (req, res) => {
    const updateData = req.body;

    try {
        const updatedTypeUser = await TypeUser.findByIdAndUpdate(
            req.params.typeUserId,
            updateData,
            { new: true }
        ).populate('permissions');

        if (!updatedTypeUser) return res.status(404).json({ message: 'TypeUser not found' });
        res.json(updatedTypeUser);
    } catch (err) {
        res.status(400).json({ message: 'Error updating TypeUser', error: err.message });
    }
});

// Delete a TypeUser
router.delete('/:typeUserId', async (req, res) => {
    try {
        const deletedTypeUser = await TypeUser.findByIdAndDelete(req.params.typeUserId);
        if (!deletedTypeUser) return res.status(404).json({ message: 'TypeUser not found' });
        res.status(200).json({ message: 'TypeUser deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting TypeUser', error: err.message });
    }
});

// Add a permission to a TypeUser
router.post('/:typeUserId/permissions', async (req, res) => {
    try {
        // Assuming req.body contains the permissionId to add
        const { permissionId } = req.body;
        const typeUser = await TypeUser.findByIdAndUpdate(
            req.params.typeUserId,
            { $addToSet: { permissions: permissionId } }, // $addToSet prevents duplicates
            { new: true }
        ).populate('permissions');

        if (!typeUser) return res.status(404).json({ message: 'TypeUser not found' });
        res.json(typeUser);
    } catch (err) {
        res.status(400).json({ message: 'Error adding permission', error: err.message });
    }
});

// Remove a permission from a TypeUser
router.delete('/:typeUserId/permissions/:permissionId', async (req, res) => {
    try {
        const typeUser = await TypeUser.findByIdAndUpdate(
            req.params.typeUserId,
            { $pull: { permissions: req.params.permissionId } }, // $pull removes from array
            { new: true }
        ).populate('permissions');

        if (!typeUser) return res.status(404).json({ message: 'TypeUser not found' });
        res.json(typeUser);
    } catch (err) {
        res.status(400).json({ message: 'Error removing permission', error: err.message });
    }
});




module.exports = router;
