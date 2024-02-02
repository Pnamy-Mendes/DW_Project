const express = require('express');
const Permission = require('../models/Permission');
const router = express.Router();

// Get all permissions
router.get('/', async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching permissions', error: err.message });
    }
});

// Get a single permission by ID
router.get('/:permissionId', async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.permissionId);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });
        res.json(permission);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching permission', error: err.message });
    }
});

// Create a new permission
router.post('/', async (req, res) => {
    const permission = new Permission(req.body);
    try {
        const newPermission = await permission.save();
        res.status(201).json(newPermission);
    } catch (err) {
        res.status(400).json({ message: 'Error creating permission', error: err.message });
    }
});

// Update a permission
router.put('/:permissionId', async (req, res) => {
    try {
        const updatedPermission = await Permission.findByIdAndUpdate(
            req.params.permissionId,
            req.body,
            { new: true }
        );

        if (!updatedPermission) return res.status(404).json({ message: 'Permission not found' });
        res.json(updatedPermission);
    } catch (err) {
        res.status(400).json({ message: 'Error updating permission', error: err.message });
    }
});

// Delete a permission
router.delete('/:permissionId', async (req, res) => {
    try {
        const deletedPermission = await Permission.findByIdAndDelete(req.params.permissionId);
        if (!deletedPermission) return res.status(404).json({ message: 'Permission not found' });
        res.status(200).json({ message: 'Permission deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting permission', error: err.message });
    }
});

module.exports = router;
