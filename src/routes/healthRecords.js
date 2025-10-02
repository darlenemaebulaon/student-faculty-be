const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');

// GET /api/portal/health-records  -> return the authenticated user's EHR (read-only)
router.get('/', requireAuth, 
  async (req, res) => {
  try {
    const hr = await HealthRecord.findOne({ 
      user: req.user._id 
    });
    if (!hr) return res.json({ 
      visits: [] 
    });
    res.json(hr);
  } catch (err) { 
    res.status(500).json({ 
      message: 'Server error' 
    }); }
});

module.exports = router;
