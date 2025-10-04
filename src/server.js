require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// Import route handlers
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const appointmentRoutes = require('./routes/appointments');
const healthRoutes = require('./routes/healthRecords');
const announcementRoutes = require('./routes/announcements');
const notificationRoutes = require('./routes/notifications');
const medicalCertRoutes = require('./routes/medicalCerts');
const inventoryRoutes = require('./routes/inventory');
const feedbackRoutes = require('./routes/feedback');

const app = express();
connectDB();

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/portal/dashboard', dashboardRoutes);
app.use('/api/portal/appointments', appointmentRoutes);
app.use('/api/portal/health-records', healthRoutes);
app.use('/api/portal/announcements', announcementRoutes);
app.use('/api/portal/notifications', notificationRoutes);
app.use('/api/portal/medical-certs', medicalCertRoutes);
app.use('/api/portal/inventory', inventoryRoutes);
app.use('/api/portal/feedback', feedbackRoutes);

app.get('/', (req,res) => res.send('UA Clinic Portal Backend is running'));

// error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
