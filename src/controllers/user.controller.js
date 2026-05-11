'use strict';

const { User } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'Profile fetched.', req.user);
  } catch (err) {
    next(err);
  }
};

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

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 404, 'User not found.');

    await user.destroy();
    return sendSuccess(res, 200, 'User deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, getAllUsers, getUserById, updateUser, deleteUser };
