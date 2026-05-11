'use strict';

const { User } = require('../models');

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
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

const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
  return users.map(formatUser);
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) notFound();
  return formatUser(user);
};

const updateUser = async (id, { name, email }) => {
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

  await user.update({ name, email });
  return formatUser(user);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) notFound();
  await user.destroy();
};

module.exports = { getMe, getAllUsers, getUserById, updateUser, deleteUser };
