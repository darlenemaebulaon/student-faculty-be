const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true },
  visits: [
    {
      date: Date,
      reason: String,
      diagnosis: String,
      notes: String,
      prescriptions: [{ 
        name: String, 
        dose: String }],
      labResults: [{ 
        name: String, 
        result: String, 
        date: Date, 
        notes: String }]
    }
  ],

  createdAt: { 
    type: Date, default: Date.now 
  }
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
