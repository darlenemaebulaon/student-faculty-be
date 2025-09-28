const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['on-site','online'], required: true },
  preferredDate: { type: Date, required: true },
  preferredTime: { type: String },
  reason: { type: String },
  status: { type: String, enum: ['pending','approved','rejected','cancelled','completed'], default: 'pending' },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
