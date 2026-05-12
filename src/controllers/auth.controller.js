'use strict';

const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = await authService.register({ name, email, password });
    return sendSuccess(res, 201, 'User registered successfully.', data);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return sendSuccess(res, 200, 'Login successful.', data);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
