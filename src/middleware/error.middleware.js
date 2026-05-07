'use strict';

/**
 * Global error handling middleware.
 * Must have 4 params (err, req, res, next) to be recognized by Express.
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}${!isProduction ? `\n${err.stack}` : ''}`);

  res.status(statusCode).json({
    status: 'error',
    message,
    // Only expose stack trace outside production
    ...(!isProduction && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
