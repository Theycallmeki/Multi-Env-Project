'use strict';

const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required().messages({
    'string.min': 'Name must be at least 2 characters.',
    'string.max': 'Name cannot exceed 60 characters.',
    'any.required': 'Name is required.',
  }),
  email: Joi.string().trim().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).max(72).required().messages({
    'string.min': 'Password must be at least 8 characters.',
    'string.max': 'Password cannot exceed 72 characters.',
    'any.required': 'Password is required.',
  }),
  role: Joi.string().valid('admin', 'user').messages({
    'any.only': 'Role must be either admin or user.',
  }),
});

const updateMeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).messages({
    'string.min': 'Name must be at least 2 characters.',
    'string.max': 'Name cannot exceed 60 characters.',
  }),
  email: Joi.string().trim().email().lowercase().messages({
    'string.email': 'Please provide a valid email address.',
  }),
}).min(1).messages({
  'object.min': 'Please provide at least one field to update (name or email).',
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required.',
  }),
  newPassword: Joi.string().min(8).max(72).required().messages({
    'string.min': 'New password must be at least 8 characters.',
    'string.max': 'New password cannot exceed 72 characters.',
    'any.required': 'New password is required.',
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'New passwords do not match.',
    'any.required': 'Please confirm your new password.',
  }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).messages({
    'string.min': 'Name must be at least 2 characters.',
    'string.max': 'Name cannot exceed 60 characters.',
  }),
  email: Joi.string().trim().email().lowercase().messages({
    'string.email': 'Please provide a valid email address.',
  }),
  role: Joi.string().valid('admin', 'user').messages({
    'any.only': 'Role must be either admin or user.',
  }),
}).min(1).messages({
  'object.min': 'Please provide at least one field to update (name, email, or role).',
});

const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().max(100).allow(''),
  role: Joi.string().valid('admin', 'user'),
  sortBy: Joi.string().valid('createdAt', 'name', 'email', 'role').default('createdAt'),
  order: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
});

const paramIdSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'Invalid user ID format. Must be a valid UUID.',
    'any.required': 'User ID is required.',
  }),
});

module.exports = {
  createUserSchema,
  updateMeSchema,
  changePasswordSchema,
  updateUserSchema,
  userQuerySchema,
  paramIdSchema,
};
