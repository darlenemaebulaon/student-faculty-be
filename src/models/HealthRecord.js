const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },

  //Basic Information
  name: {
    surname: String,
    firstName: String,
    middleName: String
  },
  contactNumber: String,
  birthday: Date,
  birthplace: String,
  sex: { 
    type: String, 
    enum: ['Male', 'Female'] },
  religion: String,
  address: String,
  fatherName: String,
  motherName: String,
  spouseName: String,

  //Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    address: String,
    contactNumber: String
  },

  //Academic / Clinic Info
  courseYearSection: String,
  physician: String,
  nurse: String,

  //PE Findings
  date: Date,
  age: Number,
  peFindings: {
    ht: String,
    wt: String,
    bp: String,
    lmp: String,
    diagnosis: String,
    treatment: String
  },

  //Medical History
  medicalHistory: {
    heartLungProblem: {
      hasIssue: { 
        type: String, 
        enum: ['Yes', 'No'] },
      specify: String
    },
    seizure: {
      hasIssue: { 
        type: String, 
        enum: ['Yes', 'No'] },
      specify: String
    },
    syncope: {
      hasIssue: { 
        type: String, 
        enum: ['Yes', 'No'] },
      specify: String
    },
    physicalInjury: {
      hasIssue: { 
        type: String, 
        enum: ['Yes', 'No'] },
      specify: String
    },
    fracture: {
      hasIssue: { 
        type: String, 
        enum: ['Yes', 'No'] },
      specify: String
    },
    scoliosis: { 
      type: String, 
      enum: ['Yes', 'No'] },
    takingMedicines: {
      hasIssue: { 
        type: String, 
        enum: ['Yes', 'No'] },
      specify: String
    },
    others: String
  },

  certification: {
    studentName: String,
    parentGuardianName: String,
    date: Date
  },

  //Medical Form
  medicalForm: {
    date: Date,
    name: String,
    problem: String,
    findingsAndRecommendations: {
      physicallyFit: Boolean,
      normalPE: Boolean,
      wellAdult: Boolean
    },
    pe: String,
    diagnosis: String,
    plan: String,
    nutritionalAssessment: {
      underweight: Boolean,
      normal: Boolean,
      overweight: Boolean,
      obese: Boolean,
      morbidlyObese: Boolean
    },
    recommendations: {
      increaseActivity: Boolean,
      increaseCalorieIntake: Boolean,
      laboratoryTest: Boolean
    }
  },

  createdAt: { 
    type: Date, 
    default: Date.now }
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
