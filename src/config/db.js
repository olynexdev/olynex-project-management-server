const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const URL = "mongodb+srv://olynex-management:L7K0v0iNNDXC8Jqt@cluster0.fzxjbem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// MongoDB connection function
const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!URL) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'olynex-managements' // Database name
    });

    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
