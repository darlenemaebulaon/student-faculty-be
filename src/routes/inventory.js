const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const InventoryRequest = require('../models/InventoryRequest');
const Notification = require('../models/Notification');

// POST /api/portal/inventory  (request medicines)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items } = req.body; // [{ name, qty }]
    const doc = await InventoryRequest.create({ user: req.user._id, items });
    await Notification.create({ user: req.user._id, title: 'Inventory request submitted', message: 'Your medicine request has been submitted.' });
    res.status(201).json(doc);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// GET user's inventory requests
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await InventoryRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
