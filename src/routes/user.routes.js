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

router.use(protect);

router.get('/me', getMe);

router.get('/', restrictTo('admin'), getAllUsers);
router.get('/:id', restrictTo('admin'), getUserById);
router.put('/:id', restrictTo('admin'), updateUser);
router.delete('/:id', restrictTo('admin'), deleteUser);

module.exports = router;
