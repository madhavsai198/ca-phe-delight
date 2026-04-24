require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: `"Ca Phe Bistro 🍵" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_TO,
  subject: `✅ Test email — Ca Phe Bistro contact form`,
  html: `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fdf8f3; border-radius: 12px; overflow: hidden;">
      <div style="background: #6b3f1f; padding: 24px 32px;">
        <h1 style="color: #f5d9a8; margin: 0; font-size: 22px; font-weight: normal;">Ca Phe Bistro</h1>
        <p style="color: #f5d9a8cc; margin: 4px 0 0; font-size: 13px;">Email integration test</p>
      </div>
      <div style="padding: 32px; color: #2d1a0e;">
        <p style="font-size: 16px;">🎉 Your email notifications are working!</p>
        <p>Every time a visitor submits the contact form on your website, you'll receive a message like this at <strong>madhavsaiv789@gmail.com</strong>.</p>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">Sent at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
      </div>
    </div>
  `,
}).then(info => {
  console.log('✅ Email sent successfully!');
  console.log('Message ID:', info.messageId);
  process.exit(0);
}).catch(err => {
  console.error('❌ Email failed:', err.message);
  process.exit(1);
});
