const express = require('express');
const router = express.Router();
const { requireAuth, authorizeRoles } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/HealthRecord');
const Announcement = require('../models/Announcement');

// Route: GET /api/portal/dashboard
router.get('/dashboard', 
  requireAuth, authorizeRoles('student','faculty'), 
  async (req,res) => {
  try {
    const now = new Date();
    const upcomingAppointments = await Appointment.find({
      user: req.user._id,
      appointmentDate: { $gte: now },
      status: { $in: ['pending','approved'] }
    }).sort({ appointmentDate: 1 }).limit(5);

    const recentAnnouncements = await Announcement.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      upcomingAppointments,
      recentAnnouncements,
      quickLinks: {
        createAppointment: '/api/portal/appointments',
        viewRecords: '/api/portal/records',
        announcements: '/api/portal/announcements'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Appointments
// POST /api/portal/appointments
router.post('/appointments',
  requireAuth, authorizeRoles('student','faculty'),
  [
    body('type').isIn(['on-site','online']),
    body('preferredDate').isISO8601().toDate(),
    body('reason').optional().isString()
  ],
  
  async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ 
      errors: errors.array() 
    });

    try {
      const { type, preferredDate, preferredTime, reason } = req.body;

      const appointment = new Appointment({
        requester: req.user._id,
        type,
        preferredDate,
        preferredTime,
        reason
      });
      await appointment.save();

      res.status(201).json(appointment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        message: 'Server error' 
      });
    }
  }
);

// GET /api/portal/appointments
router.get('/appointments', 
  requireAuth, authorizeRoles('student','faculty'), 
  async (req,res) => {
  try {
    const appointments = await Appointment.find({ 
      requester: req.user._id 
    })
    .sort({ 
      createdAt: -1 
    });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// GET single appointment
router.get('/appointments/:id', 
  requireAuth, authorizeRoles('student','faculty'), 
  async (req,res) => {
  try {
    const appt = await Appointment.findById(req.params.id);

    if (!appt) return res.status(404).json({ 
      message: 'Appointment not found' 
    });
    if (appt.requester.toString() !== req.user._id.toString()) 
      return res.status(403).json({ 
        message: 'Not authorized' 
      });
    res.json(appt);

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// Cancel appointment (user)
router.put('/appointments/:id/cancel', 
  requireAuth, authorizeRoles('student','faculty'), 
  async (req,res) => {
  try {
    const appt = await Appointment.findById(req.params.id);

    if (!appt) return res.status(404).json({ 
      message: 'Appointment not found' 
    });

    if (appt.requester.toString() !== req.user._id.toString()) 
      return res.status(403).json({ 
        message: 'Not authorized' 
      });

    if (appt.status === 'cancelled' || appt.status === 'completed') 
      return res.status(400).json({ 
        message: 'Cannot cancel' 
      });
  
    appt.status = 'cancelled';
    appt.updatedAt = new Date();

    await appt.save();
    res.json({ 
      message: 'Appointment cancelled', 
      appointment: appt 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// Health records - read-only view of own records
// GET /api/portal/records
router.get('/records', 
  requireAuth, authorizeRoles('student','faculty'), 
  async (req,res) => {
  try {
    const records = await MedicalRecord.find({ 
      patient: req.user._id 
    })
    .sort({ 
      visitDate: -1 
    });
    res.json(records);

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// GET single record
router.get('/records/:id', 
  requireAuth, authorizeRoles('student','faculty'), 
  async (req,res) => {
  try {
    const rec = await MedicalRecord.findById(req.params.id);
    if (!rec) return res.status(404).json({ 
      message: 'Record not found' 
    });
    if (rec.patient.toString() !== req.user._id.toString()) 
      return res.status(403).json({ 
        message: 'Not authorized' 
      });
    res.json(rec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// Announcements
router.get('/announcements', 
  requireAuth, authorizeRoles('student','faculty'), 
  async (req,res) => {
  try {
    const announcements = await Announcement.find().sort({ 
      createdAt: -1 
    });
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

module.exports = router;
