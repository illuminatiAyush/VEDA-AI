/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DATABASE CONFIG — MongoDB Mongoose Connection                  ║
 * ║  Handles Atlas connection logic and failure retry safety.        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log(`🔍 Checking MONGO_URI variable... Status: ${mongoUri ? "FOUND" : "NOT FOUND"} (Length: ${mongoUri ? mongoUri.length : 0})`);
    
    if (!mongoUri) {
      console.error('❌ MONGO_URI environment variable is missing!');
      process.exit(1);
    }

    console.log("🔌 Attempting to connect to MongoDB Atlas...");
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout instead of default 30s so it fails fast
    });

    console.log(`🔌 MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failure: ${error.message}`);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
