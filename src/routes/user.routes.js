'use strict';

const { Router } = require('express');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const {
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

const router = Router();

// All routes below require a valid JWT
router.use(protect);

// GET /api/v1/users/me  — current logged-in user
router.get('/me', getMe);

// Admin-only routes
router.get('/', restrictTo('admin'), getAllUsers);
router.get('/:id', restrictTo('admin'), getUserById);
router.put('/:id', restrictTo('admin'), updateUser);
router.delete('/:id', restrictTo('admin'), deleteUser);

module.exports = router;
