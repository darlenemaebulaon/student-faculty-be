const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// Public: list announcements
router.get('/', async (req, res) => {
  try {
    const anns = await Announcement.find().sort({ 
      createdAt: -1 
    }).limit(20);
    
    res.json(anns);
  } catch (err) { 
    res.status(500).json({ 
      message: 'Server error' 
    }); 
  }
});

module.exports = router;
