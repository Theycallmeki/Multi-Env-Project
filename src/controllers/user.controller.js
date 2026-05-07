'use strict';

const { User } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

// ── GET /api/v1/users/me ──────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'Profile fetched.', req.user);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/users ─────────────────────────────────────────────────────────
// Admin only
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    return sendSuccess(res, 200, 'Users fetched.', users);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/users/:id ─────────────────────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return sendError(res, 404, 'User not found.');
    return sendSuccess(res, 200, 'User fetched.', user);
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/v1/users/:id ─────────────────────────────────────────────────────
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 404, 'User not found.');

    const { name, email } = req.body;
    await user.update({ name, email });

    return sendSuccess(res, 200, 'User updated.', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/v1/users/:id ──────────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 404, 'User not found.');

    await user.destroy(); // soft delete (paranoid: true)
    return sendSuccess(res, 200, 'User deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, getAllUsers, getUserById, updateUser, deleteUser };
