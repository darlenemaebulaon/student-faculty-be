const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitDate: { type: Date, required: true },
  diagnosis: { type: String },
  labResults: [
    {
      testName: String,
      result: String,
      notes: String
    }
  ],
  prescriptions: [
    {
      medicine: String,
      dosage: String,
      instructions: String
    }
  ],
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
