'use strict';

const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { Op } = require('sequelize');

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const notFound = () => {
  const err = new Error('User not found.');
  err.statusCode = 404;
  throw err;
};

const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });
  if (!user) notFound();
  return formatUser(user);
};

const getAllUsers = async ({ page = 1, limit = 20, search, role, sortBy = 'createdAt', order = 'DESC' }) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const allowedSortFields = ['createdAt', 'name', 'email', 'role'];
  const sanitizedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sanitizedOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    order: [[sanitizedSortBy, sanitizedOrder]],
    limit,
    offset,
  });

  return {
    users: rows.map(formatUser),
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) notFound();
  return formatUser(user);
};

const createUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const err = new Error('Email is already registered.');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword, role: role || 'user' });
  return formatUser(user);
};

const updateUser = async (id, { name, email, role }) => {
  const user = await User.findByPk(id);
  if (!user) notFound();

  if (email && email !== user.email) {
    const taken = await User.findOne({ where: { email } });
    if (taken) {
      const err = new Error('Email is already in use by another account.');
      err.statusCode = 409;
      throw err;
    }
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (role !== undefined) updates.role = role;

  await user.update(updates);
  return formatUser(user);
};

const updateMe = async (userId, { name, email }) => {
  const user = await User.findByPk(userId);
  if (!user) notFound();

  if (email && email !== user.email) {
    const taken = await User.findOne({ where: { email } });
    if (taken) {
      const err = new Error('Email is already in use by another account.');
      err.statusCode = 409;
      throw err;
    }
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;

  await user.update(updates);
  return formatUser(user);
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findByPk(userId);
  if (!user) notFound();

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const err = new Error('Current password is incorrect.');
    err.statusCode = 401;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await user.update({ password: hashedPassword });
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) notFound();
  await user.destroy();
};

module.exports = { getMe, getAllUsers, getUserById, createUser, updateUser, updateMe, changePassword, deleteUser };
