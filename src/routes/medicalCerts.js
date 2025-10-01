const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const MedicalCertRequest = require('../models/MedicalCertRequest');
const Notification = require('../models/Notification');
const { sendMail } = require('../utils/mailer');

// Create request
router.post('/', requireAuth, async (req, res) => {
  const { reqType, reason } = req.body;
  try {
    const reqDoc = new MedicalCertRequest({
      user: req.user._id,
      reqType,
      reason
    });
    await reqDoc.save();

    await Notification.create({
      user: req.user._id,
      title: 'Medical certificate request submitted',
      message: `Your ${reqType} request has been submitted.`
    });

    await sendMail(req.user.email, 'Medical certificate request submitted', `Your ${reqType} request has been submitted.`).catch(e => console.log(e.message));
    res.status(201).json(reqDoc);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Get user's requests
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await MedicalCertRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
