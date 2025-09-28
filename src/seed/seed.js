/**
 * Run: npm run seed
 * Creates sample users, announcements, medical records, and an appointment.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Announcement = require('../models/Announcement');
const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

const seed = async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb+srv://darlenemaebulaon:darlenm04212004@ua-database.yq4y3.mongodb.net/student_faculty_portal?retryWrites=true&w=majority&appName=UA-DATABASE');

  // clear
  await User.deleteMany({});
  await Announcement.deleteMany({});
  await MedicalRecord.deleteMany({});
  await Appointment.deleteMany({});

  // create users
  const salt = await bcrypt.genSalt(10);
  const pass1 = await bcrypt.hash('password123', salt);
  const pass2 = await bcrypt.hash('password123', salt);

  const student = new User({
    fullName: 'Juan Dela Cruz',
    email: 'juandelacruz.student@ua.edu.ph',
    password: pass1,
    role: 'student',
    studentId: '2022000999'
  });
  const faculty = new User({
    fullName: 'Kiko Barzaga',
    email: 'kikomeow@ua.edu.ph',
    password: pass2,
    role: 'faculty'
  });
  await student.save();
  await faculty.save();

  // announcements
  await Announcement.create([
    { title: 'Flu Vaccination Drive', message: 'Free flu shots on Oct 15 at the clinic. Bring your student ID.', postedBy: 'Clinic Admin' },
    { title: 'Extended Hours', message: 'Clinic open until 6pm during midterms week.', postedBy: 'Clinic Admin', pinned: true }
  ]);

  // medical record for student
  await MedicalRecord.create({
    patient: student._id,
    visitDate: new Date('2025-04-10'),
    diagnosis: 'Upper Respiratory Infection',
    labResults: [{ testName: 'CBC', result: 'Normal', notes: '' }],
    prescriptions: [{ medicine: 'Paracetamol', dosage: '500 mg', instructions: 'PRN for fever' }],
    notes: 'Rest, hydration recommended.'
  });

  // sample appointment
  await Appointment.create({
    requester: student._id,
    type: 'on-site',
    preferredDate: new Date(new Date().getTime() + 2*24*60*60*1000),
    preferredTime: '10:00',
    reason: 'Follow-up for cough',
    status: 'pending'
  });

  console.log('Seed data created. Sample accounts:');
  console.log('- Student: juandelacruz.student@ua.edu.ph / password123');
  console.log('- Faculty: kikomeow@ua.edu.ph / password123');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
