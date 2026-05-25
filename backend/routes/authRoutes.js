/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AUTH ROUTES — User Authentication Router                        ║
 * ║  Integrates register, login, and status endpoints                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateBody, registerSchema, loginSchema } = require('../utils/validators');

async function authRoutes(fastify, options) {
  
  /**
   * POST /api/auth/register
   * Registers a new user with email, password, name, and role.
   */
  fastify.post('/auth/register', {
    preHandler: [validateBody(registerSchema)],
    handler: authController.register,
  });

  /**
   * POST /api/auth/login
   * Authenticates existing user and returns JWT.
   */
  fastify.post('/auth/login', {
    preHandler: [validateBody(loginSchema)],
    handler: authController.login,
  });

  /**
   * GET /api/auth/me
   * Retrieves profile of current logged-in user.
   */
  fastify.get('/auth/me', {
    preHandler: [authenticate],
    handler: authController.getMe,
  });

  /**
   * POST /api/auth/update-password
   * Updates password of the current authenticated user.
   */
  fastify.post('/auth/update-password', {
    preHandler: [authenticate],
    handler: authController.updatePassword,
  });
}

module.exports = authRoutes;
