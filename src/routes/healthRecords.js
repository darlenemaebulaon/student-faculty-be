const express = require('express');
const router = express.Router();
const { requireAuth, authorizeRoles } = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');

//Create new health record (Admin only)
router.post('/', 
  requireAuth, authorizeRoles('admin'), 
  async (req, res) => {
  try {
    const record = await HealthRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

//Get all (Admin)
router.get('/', 
  requireAuth, authorizeRoles('admin'), 
  async (req, res) => {
  try {
    const list = await HealthRecord.find().populate('user', 'fullName email');
    res.json(list);
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

//Get own record (Student/Faculty)
router.get('/me', 
  requireAuth, authorizeRoles('student', 'faculty'), 
  async (req, res) => {
  try {
    const record = await HealthRecord.findOne({ 
      user: req.user._id 
    });
    if (!record) return res.status(404).json({ 
      message: 'Record not found' 
    });
    res.json(record);
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

//Update record (Admin only)
router.put('/:id', 
  requireAuth, authorizeRoles('admin'), 
  async (req, res) => {
  try {
    const updated = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ 
      message: 'Not found' 
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

//Delete record (Admin only)
router.delete('/:id', 
  requireAuth, authorizeRoles('admin'), 
  async (req, res) => {
  try {
    const deleted = await HealthRecord.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ 
      message: 'Not found' 
    });
    res.json({ 
      message: 'Deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

module.exports = router;
