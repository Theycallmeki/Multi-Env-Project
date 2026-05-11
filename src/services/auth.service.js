'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/env');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const err = new Error('Email is already registered.');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  return {
    token: generateToken(user),
    user: formatUser(user),
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  const invalidErr = new Error('Invalid email or password.');
  invalidErr.statusCode = 401;

  if (!user) throw invalidErr;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw invalidErr;

  return {
    token: generateToken(user),
    user: formatUser(user),
  };
};

module.exports = { register, login };
