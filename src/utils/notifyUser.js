const Notification = require('../models/Notification');
const { sendMail } = require('./mailer');
const User = require('../models/User');

/**
 * Create a new notification and send email
 */
exports.notifyUser = async (userId, title, message, type = 'general') => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    await Notification.create({ user: userId, title, message, type });

    await sendMail(
      user.email,
      `UA Clinic Notification: ${title}`,
      `<h3>${title}</h3><p>${message}</p><p>- UA Clinic</p>`
    );

    console.log(`Notification + email sent to ${user.email}`);
  } catch (err) {
    console.error(`Notification error:`, err.message);
  }
};
