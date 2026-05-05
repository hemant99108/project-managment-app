const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createError } = require('../utils/apiError');

// Verify JWT and attach user to request
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError(401, 'Access denied. No token provided.'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(createError(401, 'Token is invalid or user no longer exists.'));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createError(401, 'Token has expired. Please log in again.'));
    }
    return next(createError(401, 'Invalid token.'));
  }
};

// Allow only Admin role
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'Admin') {
    return next(createError(403, 'Access denied. Admin role required.'));
  }
  next();
};

// Allow Admin OR Member (any authenticated user)
const requireMember = (req, res, next) => {
  if (!['Admin', 'Member'].includes(req.user?.role)) {
    return next(createError(403, 'Access denied.'));
  }
  next();
};

module.exports = { authenticate, requireAdmin, requireMember };
