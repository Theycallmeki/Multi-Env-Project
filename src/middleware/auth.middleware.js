'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { sendError } = require('../utils/response');
const { User } = require('../models');

/**
 * Protect routes — verifies the JWT token from the Authorization header.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'No token provided. Authorization denied.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    // Attach user to request (without password)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return sendError(res, 401, 'User no longer exists.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expired. Please log in again.');
    }
    return sendError(res, 401, 'Invalid token.');
  }
};

/**
 * Restrict access to specific roles.
 * Usage: restrictTo('admin')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, 'You do not have permission to perform this action.');
    }
    next();
  };
};

module.exports = { protect, restrictTo };
