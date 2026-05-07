'use strict';

/**
 * Standardized API response helpers.
 * Use these in all controllers for consistent response shapes.
 */

/**
 * Send a success response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Success message
 * @param {any} data - Response payload
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = { status: 'success', message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} message - Error message
 * @param {any} errors - Optional error details
 */
const sendError = (res, statusCode = 500, message = 'Something went wrong', errors = null) => {
  const response = { status: 'error', message };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
