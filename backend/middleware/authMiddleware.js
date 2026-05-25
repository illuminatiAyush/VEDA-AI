/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AUTH MIDDLEWARE — JWT Verification & Route Protection           ║
 * ║  Extracts bearer token and hydrates request with MongoDB user.    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        success: false,
        error: 'Access denied. No session token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'secretkey123';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid or expired session token.',
      });
    }

    // Hydrate request with database user (excluding hashed password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Session owner does not exist.',
      });
    }

    // Attach user to request context
    request.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    request.log.error({ err: error }, 'Auth middleware execution failed');
    return reply.status(500).send({
      success: false,
      error: 'Authentication process failure',
    });
  }
};

module.exports = {
  authenticate,
};
