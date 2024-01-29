// categoriesRoute.js
const mongoose = require('mongoose');
const express = require('express');
const { checkPermission } = require('../middleware/authMiddleware');
checkPermission('admin')

const router = express.Router();

// Get all root categories
router.get('/', async (req, res) => {
    try {
        // Fetch categories that do not have a parentCategory (i.e., root categories)
        const rootCategories = await Category.find({ parentCategory: { $eq: null } });
        res.json(rootCategories);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching root categories', error: err.message });
    }
});

// Get all categories with parent information
router.get('/categories-with-parents', async (req, res) => {
    try {
        const categories = await Category.find().lean();
        const categoriesWithParents = categories.map(cat => {
            return {
                _id: cat._id.toString(),
                name: cat.name,
                parentCategory: cat.parentCategory ? cat.parentCategory.toString() : null,
            };
        });
        res.json(categoriesWithParents);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
});


// Get subcategories for a given category
router.get('/:categoryId/subcategories', async (req, res) => {
    try {
        // Fetch subcategories based on parentCategory
        const subcategories = await Category.find({ parentCategory: req.params.categoryId });

        // For each subcategory, fetch its sub-subcategories
        const subcategoriesWithChildren = await Promise.all(subcategories.map(async (subcategory) => {
            const children = await Category.find({ parentCategory: subcategory._id });
            return { ...subcategory.toObject(), children };
        }));

        res.json(subcategoriesWithChildren);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching subcategories', error: err.message });
    }
});



// Get a single category by ID
router.get('/:categoryId', async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching category', error: err.message });
    }
});

// Create a new category
router.post('/', checkPermission('admin'), async (req, res) => {
    const category = new Category({
        name: req.body.name,
        parentCategory: req.body.parentCategory || null
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: 'Error creating category', error: err.message });
    }
});

// Update a category
router.put('/:categoryId', checkPermission('admin'), async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.categoryId,
            req.body,
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: 'Error updating category', error: err.message });
    }
});

// Using findByIdAndDelete
router.delete('/:categoryId', checkPermission('admin'), async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.categoryId);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.send('Category deleted successfully');
    } catch (error) {
        console.error('Error deleting category', error);
        res.status(400).send('Error deleting category');
    }
});

module.exports = router;
