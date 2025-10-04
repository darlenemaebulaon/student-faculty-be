const nodemailer = require('nodemailer'); // Library for sending emails
const dotenv = require('dotenv');
dotenv.config();

// Create a transporter object using SMTP settings from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Sends an email notification.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML message body
 */

exports.sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
              ${html}
              <hr/>
              <p style="font-size: 12px; color: #666;">UA Clinic Portal</p>
             </div>`
    });
    console.log(`Email sent to ${to} — ${subject}`);
  } catch (err) {
    console.error(`Email error: ${err.message}`);
  }
};