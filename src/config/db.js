const mongoose = require('mongoose');

//Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to establish a connection using the connection string from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Ensures new MongoDB URL parser is used
      useUnifiedTopology: true, // Enables the new unified topology engine
    });

    console.log('MongoDB connected');

  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    
    process.exit(1);
  }
};

module.exports = connectDB;
