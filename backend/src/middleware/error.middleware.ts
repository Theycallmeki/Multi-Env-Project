import logger from "../utils/logger";

const errorMiddleware = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'This record conflicts with an existing value (duplicate key).';
  } else if (err.name === 'SequelizeValidationError' && err.errors?.length) {
    statusCode = 422;
    message = err.errors.map((e) => e.message).join(' ');
  }

  logger.error(`[Error] ${statusCode} - ${message}`, { stack: err.stack });

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(!isProduction && { stack: err.stack }),
  });
};

export default errorMiddleware;
