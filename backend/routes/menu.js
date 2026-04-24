const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { auth, requireAdmin } = require('../middleware/auth');

// Get all active menu items (Public)
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ is_active: true }).sort({ category: 1, sort_order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all menu items including inactive (Admin only)
router.get('/all', auth, requireAdmin, async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, sort_order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new menu item (Admin only)
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update menu item (Admin only)
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete menu item (Admin only)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
