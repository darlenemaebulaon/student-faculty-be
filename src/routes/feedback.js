const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const { sendMail } = require('../utils/mailer');


router.post('/', requireAuth, 
  async (req, res) => {
  try {
    const { message } = req.body;
    const f = await Feedback.create({ 
      user: req.user._id, 
      message
    });

    await sendMail(
      req.user.email,
      'Feedback Received',
      `<p>Thank you for your feedback. We’ve received your message:</p><blockquote>${message}</blockquote><p>- UA Clinic</p>`
    );

    res.status(201).json(f);
  } catch (err) { 
    res.status(500).json({ 
      message: 'Server error' 
    }); 
  }
});

module.exports = router;
