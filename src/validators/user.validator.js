'use strict';

const Joi = require('joi');

const updateUserSchema = Joi.object({
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

module.exports = { updateUserSchema };
