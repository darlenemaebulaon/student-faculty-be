const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendMail(to, subject, text, html = null) {
  if (!process.env.SMTP_USER) {
    console.log('SMTP not configured — skipping email:', subject);
    return;
  }
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html
  });
  console.log('Email sent:', info.messageId);
}

module.exports = { sendMail };
