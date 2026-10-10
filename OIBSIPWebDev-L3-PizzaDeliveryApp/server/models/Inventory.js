const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  category: { type: String, enum: ['base', 'sauce', 'cheese', 'veggie'], required: true },
  name: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  threshold: { type: Number, default: 20 }
});

module.exports = mongoose.model('Inventory', inventorySchema);
