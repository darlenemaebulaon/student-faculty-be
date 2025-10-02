const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get notifications for user
router.get('/', requireAuth, async (req, res) => {
  try {
    const notes = await Notification.find({ 
      user: req.user._id 
    }).sort({ 
        createdAt: -1 
      }).limit(50);
    res.json(notes);

  } catch (err) { res.status(500).json({ 
    message: 'Server error' 
  }); }
});

// Mark as read
router.put('/:id/read', requireAuth, 
  async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ 
      message: 'Not found' });
    if (n.user.toString() !== req.user._id.toString()) return res.status(403).json({ 
      message: 'Forbidden' 
    });
    n.isRead = true;
    await n.save();
    res.json({ 
      message: 'Marked read' 
    });
  } catch (err) { 
    res.status(500).json({ 
      message: 'Server error' 
    }); 
  }
});

module.exports = router;
