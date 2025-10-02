const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Feedback = require('../models/Feedback');

router.post('/', requireAuth, 
  async (req, res) => {
  try {
    const { message, rating } = req.body;
    const f = await Feedback.create({ 
      user: req.user._id, 
      message, rating 
    });
    res.status(201).json(f);
  } catch (err) { 
    res.status(500).json({ 
      message: 'Server error' 
    }); }
});

module.exports = router;
