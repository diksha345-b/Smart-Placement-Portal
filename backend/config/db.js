const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the connection string from the environment.
 * Exits the process on a fatal connection error so the app does not run
 * in a half-broken state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
