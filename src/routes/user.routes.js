'use strict';

const { Router } = require('express');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createUserSchema,
  updateMeSchema,
  changePasswordSchema,
  updateUserSchema,
  userQuerySchema,
  paramIdSchema,
} = require('../validators/user.validator');
const {
  getMe,
  updateMe,
  changePassword,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

const router = Router();

router.use(protect);

router.get('/me', getMe);
router.patch('/me', validate(updateMeSchema), updateMe);
router.patch('/me/password', validate(changePasswordSchema), changePassword);

router.get('/', restrictTo('admin'), validate(userQuerySchema, 'query'), getAllUsers);
router.post('/', restrictTo('admin'), validate(createUserSchema), createUser);

router.get('/:id', restrictTo('admin'), validate(paramIdSchema, 'params'), getUserById);
router.patch('/:id', restrictTo('admin'), validate(paramIdSchema, 'params'), validate(updateUserSchema), updateUser);
router.delete('/:id', restrictTo('admin'), validate(paramIdSchema, 'params'), deleteUser);

module.exports = router;
