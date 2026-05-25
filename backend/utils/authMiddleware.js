/**
 * Auth Middleware — Legacy Redirect to JWT/MongoDB Version
 * 
 * Performs secure JWT token validation against MongoDB.
 */

const { authenticate } = require('../middleware/authMiddleware');

module.exports = { authenticate };
