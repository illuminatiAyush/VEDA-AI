/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  EVALIX BACKEND — Fastify Server                               ║
 * ║  Hybrid Architecture: Backend handles AI + PDF + Business Logic ║
 * ║  Phase 1: Production Hardened (Zod + Rate Limit + Timer)        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

require('dotenv').config();
const fastify = require('fastify');
const cors = require('@fastify/cors');
const multipart = require('@fastify/multipart');
const rateLimit = require('@fastify/rate-limit');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

const app = fastify({
  logger: logger.pinoConfig,
  bodyLimit: 10 * 1024 * 1024, // 10MB — handles large JSON payloads
});

// ─── Plugins ─────────────────────────────────────────────────────
async function start() {
  // Connect to MongoDB
  await connectDB();

  // CORS — allow frontend origin
  await app.register(cors, {
    origin: true, // Reflects the origin of the request, allowing localhost, 127.0.0.1, and network IPs

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Rate Limiting — global default (60 req/min per IP)
  await app.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
    keyGenerator: (request) => {
      // Use JWT user ID if available, otherwise fall back to IP
      return request.user?.id || request.ip;
    },
    errorResponseBuilder: (request, context) => ({
      success: false,
      error: 'Rate limit exceeded. Please wait before retrying.',
      retryAfter: Math.ceil(context.ttl / 1000),
    }),
  });

  // Multipart — for file uploads (PDF)
  await app.register(multipart, {
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB max PDF
      files: 1,                    // Single file per request
    },
  });

  // Start Background Workers
  require('./workers/testWorker');

  // ─── Routes ──────────────────────────────────────────────────────
  app.register(require('./routes/authRoutes'), { prefix: '/api' });
  app.register(require('./routes/aiRoutes'), { prefix: '/api' });
  app.register(require('./routes/testRoutes'), { prefix: '/api' });

  // ─── Health Check ────────────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'ok',
    service: 'evalix-backend',
    version: '1.1.0-hardened',
    timestamp: new Date().toISOString(),
  }));

  // ─── Global Error Handler ────────────────────────────────────────
  // Show REAL error messages in responses (not generic "Internal server error")
  // so the frontend console and UI can display what actually went wrong.
  app.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;
    
    // Always log the full error with stack trace in the backend console
    console.error(`\n  ❌ [${request.method}] ${request.url} → ${statusCode}`);
    console.error(`  Message: ${error.message}`);
    if (error.stack) console.error(`  Stack: ${error.stack.split('\n').slice(0, 3).join('\n  ')}`);
    
    request.log.error({ err: error, url: request.url, method: request.method }, 'Unhandled error');

    reply.status(statusCode).send({
      success: false,
      error: error.message || 'Internal server error',
    });
  });

  // ─── Start ───────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT || '3001', 10);
  const host = '0.0.0.0';

  try {
    await app.listen({ port, host });
    console.log(`\n  ⚡ Evalix Backend v1.1.0 (Hardened) running on http://localhost:${port}\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
