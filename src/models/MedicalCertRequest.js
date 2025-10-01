const mongoose = require('mongoose');

const MCRSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reqType: { type: String, enum: ['absence', 'clearance', 'fit_to_return', 'other'], default: 'absence' },
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalCertRequest', MCRSchema);
