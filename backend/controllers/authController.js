/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AUTH CONTROLLER — User Authentication Handlers                  ║
 * ║  Handles MongoDB operations, password hashing comparison,        ║
 * ║  and JWT generation for registration and login.                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (request, reply) => {
  const { name, email, password } = request.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return reply.status(400).send({
        success: false,
        error: 'A user with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = generateToken(user);

    request.log.info({ userId: user._id, email: user.email }, 'User registered successfully');

    return reply.status(201).send({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    request.log.error({ err: error }, 'Registration failed');
    console.error('[Auth] Registration error:', error.message, error.code, error.name);

    // Handle Mongoose duplicate key error (E11000)
    if (error.code === 11000) {
      return reply.status(400).send({
        success: false,
        error: 'A user with this email already exists',
      });
    }

    // Handle Mongoose validation errors  
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message).join(', ');
      return reply.status(400).send({
        success: false,
        error: messages,
      });
    }

    return reply.status(500).send({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
};

/**
 * Log in an existing user
 * POST /api/auth/login
 */
const login = async (request, reply) => {
  const { email, password } = request.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Verify password using schema method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    request.log.info({ userId: user._id, email: user.email }, 'User logged in successfully');

    return reply.send({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    request.log.error({ err: error }, 'Login failed');
    console.error('[Auth] Login error:', error.message, error.name);
    return reply.status(500).send({
      success: false,
      error: error.message || 'Login failed',
    });
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
const getMe = async (request, reply) => {
  try {
    return reply.send({
      success: true,
      user: request.user,
    });
  } catch (error) {
    request.log.error({ err: error }, 'Failed to retrieve profile');
    return reply.status(500).send({
      success: false,
      error: 'Failed to retrieve profile',
    });
  }
};

/**
 * Update authenticated user password
 * POST /api/auth/update-password
 */
const updatePassword = async (request, reply) => {
  const { password } = request.body || {};
  const userId = request.user.id;

  if (!password || password.length < 6) {
    return reply.status(400).send({
      success: false,
      error: 'Password must be at least 6 characters',
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return reply.status(404).send({
        success: false,
        error: 'User not found',
      });
    }

    user.password = password;
    await user.save();

    request.log.info({ userId }, 'User password updated successfully');
    return reply.send({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    request.log.error({ err: error }, 'Password update failed');
    return reply.status(500).send({
      success: false,
      error: error.message || 'Password update failed',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePassword,
};
