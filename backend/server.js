require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const messagesRoutes = require('./routes/messages');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/messages', messagesRoutes);

const PORT = process.env.PORT || 5000;

// Start server only after MongoDB is ready
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caphebistro')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
