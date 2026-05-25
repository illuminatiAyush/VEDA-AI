/**
 * Logger — Structured logging with Pino
 */

const pino = require('pino');

// Pino config for Fastify
const isProduction = process.env.NODE_ENV === 'production';

const pinoConfig = {
  level: process.env.LOG_LEVEL || 'info',
};

// Only add transport if we're not in production
if (!isProduction) {
  pinoConfig.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  };
}

// Standalone logger for services (outside of request context)
const logger = pino(pinoConfig);

module.exports = { pinoConfig, logger };

