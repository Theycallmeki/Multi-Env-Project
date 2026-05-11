'use strict';

const errorMiddleware = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}${!isProduction ? `\n${err.stack}` : ''}`);

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(!isProduction && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
