'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/env');
const { sendSuccess, sendError } = require('../utils/response');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required.');
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return sendError(res, 409, 'Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user);

    return sendSuccess(res, 201, 'User registered successfully.', {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required.');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    const token = generateToken(user);

    return sendSuccess(res, 200, 'Login successful.', {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
