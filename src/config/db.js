const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    // Check if MONGO_URI is  defined
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 30000,
      dbName: 'olynex-managements', // Database name
    });

    logger.info('MongoDB connection established successfully');
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1); // Exit the process if unable to connect
  }

  // Handle disconnection
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected, trying to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected successfully');
  });

  mongoose.connection.on('error', err => {
    logger.error(`MongoDB error: ${err.message}`);
  });
};

// Export connectDB function
module.exports = connectDB;

// const retry = require('async-retry');

// async function connectWithRetry() {
//     await retry(async () => {
//         await client.connect();
//     }, {
//         retries: 5,
//         minTimeout: 1000, // 1 second
//         maxTimeout: 30000 // 30 seconds
//     });
// }

// const { MongoClient } = require('mongodb');

// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000, // 5 seconds
//     socketTimeoutMS: 45000, // 45 seconds
// });

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   poolSize: 10 // Number of connections in the pool
// });
