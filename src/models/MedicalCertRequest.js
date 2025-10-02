const mongoose = require('mongoose');

const MCRSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  reqType: { 
    type: String, 
    default: 'Medical Certificate' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminNotes: { 
    type: String 
  },

  // New fields for physician
  diagnosis: { type: String },
  recommendations: { type: String },
  physicianName: { type: String },
  licenseNo: { type: String },
  ptrNo: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalCertRequest', MCRSchema);

