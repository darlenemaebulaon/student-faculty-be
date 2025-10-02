const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'secret';

/**
 * Middleware to check if the request has a valid JWT token.
 * If valid, attaches the user object to req.user and allows the request to proceed.
 */

exports.requireAuth = async (req, res, next) => {
  // Get token from Authorization header (Bearer <token>)
  const authHeader = req.header('Authorization') || req.header('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'No token provided' });
  }

  // Extract token part
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Find user in database by ID stored in token paylo
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ 
      message: 'Token is not valid' });
  }
};

/**
 * Middleware to restrict access to certain roles.
 * Example: authorizeRoles('admin', 'faculty')
 */

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) return res.status(401).json({ 
      message: 'Not authenticated' 
    });

    // Check if user’s role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden: insufficient rights' 
      });
    }

    next();
  };
};
