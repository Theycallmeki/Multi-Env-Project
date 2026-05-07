'use strict';

const { User } = require('../models');

/**
 * Format a user instance for safe API output (no password).
 */
const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

/**
 * Throw a 404 error helper.
 */
const notFound = () => {
  const err = new Error('User not found.');
  err.statusCode = 404;
  throw err;
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the currently authenticated user's profile.
 */
const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });
  if (!user) notFound();
  return formatUser(user);
};

/**
 * Get all users (admin only).
 */
const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
  return users.map(formatUser);
};

/**
 * Get a single user by primary key.
 */
const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) notFound();
  return formatUser(user);
};

/**
 * Update a user's name and/or email.
 * @throws {Error} 409 if the new email is already taken by another user
 */
const updateUser = async (id, { name, email }) => {
  const user = await User.findByPk(id);
  if (!user) notFound();

  // Check email uniqueness if email is being changed
  if (email && email !== user.email) {
    const taken = await User.findOne({ where: { email } });
    if (taken) {
      const err = new Error('Email is already in use by another account.');
      err.statusCode = 409;
      throw err;
    }
  }

  await user.update({ name, email });
  return formatUser(user);
};

/**
 * Soft-delete a user.
 */
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) notFound();
  await user.destroy();
};

module.exports = { getMe, getAllUsers, getUserById, updateUser, deleteUser };
