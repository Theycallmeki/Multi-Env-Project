import Joi from "joi";

const registerSchema = Joi.object({
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
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match.',
    'any.required': 'Please confirm your password.',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

export {  registerSchema, loginSchema  };
