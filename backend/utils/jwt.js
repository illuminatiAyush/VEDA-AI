/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  JWT UTILITY — Signed Session Token Helper                        ║
 * ║  Signs authentication credentials with JWT_SECRET expiration.     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token for a user
 * @param {Object} user User document
 * @returns {String} Signed JWT token
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'secretkey123';
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: '30d',
    }
  );
};

module.exports = {
  generateToken,
};
