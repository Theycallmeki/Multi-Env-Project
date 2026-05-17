'use strict';

const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  return sendSuccess(res, 200, 'Profile fetched successfully.', user);
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user.id, req.body);
  return sendSuccess(res, 200, 'Profile updated successfully.', user);
});

const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  return sendSuccess(res, 200, 'Password changed successfully.');
});

const getAllUsers = asyncHandler(async (req, res) => {
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
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, 200, 'User fetched successfully.', user);
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return sendSuccess(res, 201, 'User created successfully.', user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return sendSuccess(res, 200, 'User updated successfully.', user);
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  return sendSuccess(res, 200, 'User deleted successfully.');
});

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

