const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { sendMail } = require('../utils/mailer');

// Create new appointment request
router.post('/', requireAuth, async (req, res) => {
  const { appointmentDate, type, description } = req.body;
  try {
    const appt = new Appointment({
      user: req.user._id,
      appointmentDate,
      type,
      description
    });
    await appt.save();

    // create in-app notification to user
    await Notification.create({
      user: req.user._id,
      title: 'Appointment requested',
      message: `Your appointment request for ${new Date(appointmentDate).toLocaleString()} is submitted.`
    });

    // send email (if configured)
    await sendMail(req.user.email, 'Appointment requested', `Your appointment request for ${appointmentDate} is submitted.`).catch(e => console.log(e.message));
    res.status(201).json(appt);
  } catch (err) {

    console.error(err);

    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// List user's appointments (history)
router.get('/', requireAuth, async (req, res) => {
  try {
    const appts = await Appointment.find({ 
      user: req.user._id 
    }).sort({ 
      appointmentDate: -1 
    });
    res.json(appts);

  } catch (err) {
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// Get single appointment
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ 
      message: 'Not found' 
    });

    if (appt.user.toString() !== req.user._id.toString()) 
      return res.status(403).json({ 
    message: 'Forbidden' 
  });
    res.json(appt);

  } catch (err) { 
    res.status(500).json({ 
      message: 'Server error' 
    }); 
  }
});

// Cancel appointment
router.put('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ 
      message: 'Not found' 
    });

    if (appt.user.toString() !== req.user._id.toString()) 
      return res.status(403).json({ 
    message: 'Forbidden' 
    });

    appt.status = 'cancelled';
    await appt.save();

    await Notification.create({
      user: req.user._id,
      title: 'Appointment cancelled',
      message: `You cancelled appointment on ${appt.appointmentDate}`
    });

    await sendMail(req.user.email, 'Appointment cancelled', `You cancelled appointment on ${appt.appointmentDate}`).catch(e => console.log(e.message));
    res.json({ message: 'Cancelled' });
  } catch (err) { res.status(500).json({ 
    message: 'Server error' 
  }); 
}
});

module.exports = router;
