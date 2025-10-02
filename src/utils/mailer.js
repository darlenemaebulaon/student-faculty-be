const nodemailer = require('nodemailer'); // Library for sending emails

// Create a transporter object using SMTP settings from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Sends an email using the configured transporter
 * @param {string} to - Recipient email address
 * @param {string} subject - Subject of the email
 * @param {string} text - Plain text body
 * @param {string|null} html - Optional HTML body
 */

async function sendMail(to, subject, text, html = null) {
  if (!process.env.SMTP_USER) {
    console.log('SMTP not configured — skipping email:', subject);
    return;
  }

  // Send the email
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html
  });

  console.log('Email sent:', info.messageId); // Log the unique message ID
}

module.exports = { sendMail };
