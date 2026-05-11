'use strict';

const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response');

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getMe(req.user.id);
    return sendSuccess(res, 200, 'Profile fetched successfully.', user);
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await userService.updateMe(req.user.id, req.body);
    return sendSuccess(res, 200, 'Profile updated successfully.', user);
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await userService.changePassword(req.user.id, req.body);
    return sendSuccess(res, 200, 'Password changed successfully.');
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, sortBy, order } = req.query;
    
    const result = await userService.getAllUsers({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      role,
      sortBy,
      order
    });
    
    return sendSuccess(res, 200, 'Users fetched successfully.', result);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, 200, 'User fetched successfully.', user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return sendSuccess(res, 201, 'User created successfully.', user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return sendSuccess(res, 200, 'User updated successfully.', user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return sendSuccess(res, 200, 'User deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateMe,
  changePassword,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
