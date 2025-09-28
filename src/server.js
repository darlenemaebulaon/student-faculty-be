const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
connectDB(process.env.MONGO_URI || 'mongodb+srv://darlenemaebulaon:darlenm04212004@ua-database.yq4y3.mongodb.net/student_faculty_portal?retryWrites=true&w=majority&appName=UA-DATABASE');

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/portal', require('./routes/portal'));

app.get('/', (req,res) => res.send('UA Clinic Portal Backend running'));

// error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server running on port ${port}`));
