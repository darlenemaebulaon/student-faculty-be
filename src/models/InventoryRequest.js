const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  qty: Number
});

const InventoryRequestSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  items: [ItemSchema],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },

  createdAt: { 
    type: Date, default: Date.now 
  }
});

module.exports = mongoose.model('InventoryRequest', InventoryRequestSchema);
