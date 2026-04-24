const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Coffee', 'Beverages', 'Desserts', 'Continental Food']
  },
  price: { type: Number, required: true },
  image_url: { type: String },
  description: { type: String },
  is_active: { type: Boolean, default: true },
  sort_order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
