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
const HealthRecord = require('../models/HealthRecord');
const Appointment = require('../models/Appointment');

const seed = async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb+srv://darlenemaebulaon:darlenm04212004@ua-database.yq4y3.mongodb.net/student_faculty_portal?retryWrites=true&w=majority&appName=UA-DATABASE');

  // clear
  await User.deleteMany({});
  await Announcement.deleteMany({});
  await HealthRecord.deleteMany({});
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
    { title: 'Flu Vaccination Drive', content: 'Free flu shots on Oct 15 at the clinic. Bring your student ID.', createdBy: student._id },
    { title: 'Extended Hours', content: 'Clinic open until 6pm during midterms week.', createdBy: faculty._id, pinned: true }
  ]);


  // medical record for student
  await HealthRecord.create({
  user: student._id,
  visits: [{
    date: new Date('2025-04-10'),
    reason: 'Checkup',
    diagnosis: 'Upper Respiratory Infection',
    notes: 'Rest, hydration recommended.',
    prescriptions: [{ name: 'Paracetamol', dose: '500 mg' }],
    labResults: [{ name: 'CBC', result: 'Normal', date: new Date(), notes: '' }]
  }]
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
