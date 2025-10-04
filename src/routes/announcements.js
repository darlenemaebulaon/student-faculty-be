const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { requireAuth, authorizeRoles } = require('../middleware/auth');
const { sendMail } = require('../utils/mailer');

//Admin creates announcement
router.post('/', requireAuth, authorizeRoles('admin'), 
async (req, res) => {
  try {
    const { title, content, pinned } = req.body;

    const ann = await Announcement.create({
      title,
      content,
      pinned,
      createdBy: req.user._id
    });

    // Get all users except admin
    const users = await User.find({ role: { $in: ['student', 'faculty'] } });

    // Send notifications + send email to all users
    const sendOps = users.map(async (user) => {
      await Notification.create({
        user: user._id,
        title: `New Announcement: ${title}`,
        message: content,
        type: 'announcement'
      });

      await sendMail(
        user.email,
        `UA Clinic Announcement: ${title}`,
        `
        <div style="font-family: Arial; padding: 10px;">
          <h2 style="color:#005b96;">UA Clinic Announcement</h2>
          <h3>${title}</h3>
          <p>${content}</p>
          <p style="font-size: 12px; color: #888;">This is an automated message from the UA Clinic system.</p>
        </div>
        `
      );
    });

    await Promise.all(sendOps);

    res.status(201).json({ message: 'Announcement created and emails sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: list announcements
router.get('/', async (req, res) => {
  try {
    const anns = await Announcement.find().sort({ createdAt: -1 }).limit(20);
    res.json(anns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
