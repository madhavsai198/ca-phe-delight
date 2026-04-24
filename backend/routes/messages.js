const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');
const { auth, requireAdmin } = require('../middleware/auth');

// Create Gmail transporter (reusable)
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Submit a new message/reservation (Public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // 1. Save to MongoDB
    const doc = new ContactMessage({ name, email, phone, message });
    await doc.save();

    // 2. Send email notification (non-blocking — don't fail if email fails)
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Ca Phe Bistro 🍵" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `📩 New message from ${name} — Ca Phe Bistro`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fdf8f3; border-radius: 12px; overflow: hidden;">
            <div style="background: #6b3f1f; padding: 24px 32px;">
              <h1 style="color: #f5d9a8; margin: 0; font-size: 22px; font-weight: normal; letter-spacing: 1px;">Ca Phe Bistro</h1>
              <p style="color: #f5d9a8cc; margin: 4px 0 0; font-size: 13px;">New contact form message</p>
            </div>
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #2d1a0e;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 100px; color: #6b3f1f;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #6b3f1f;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #b36a2a;">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #6b3f1f;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
              </table>
              <div style="margin-top: 20px; background: #fff; border-left: 4px solid #b36a2a; padding: 16px 20px; border-radius: 4px; color: #2d1a0e; line-height: 1.7;">
                <p style="margin: 0 0 6px; font-weight: bold; color: #6b3f1f;">Message</p>
                <p style="margin: 0;">${message.replace(/\n/g, '<br/>')}</p>
              </div>
              <p style="margin-top: 28px; font-size: 12px; color: #999;">Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            </div>
          </div>
        `,
      });
      console.log(`📧 Email sent for message from ${name}`);
    } catch (emailErr) {
      console.error('Email send failed (message still saved):', emailErr.message);
    }

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all messages (Admin only)
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update message read status (Admin only)
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { is_read } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { is_read },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete message (Admin only)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
