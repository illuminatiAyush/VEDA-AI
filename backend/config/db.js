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
    if (!mongoUri) {
      logger.error('❌ MONGO_URI environment variable is missing!');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);

    logger.info(`🔌 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ MongoDB Connection Failure: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
