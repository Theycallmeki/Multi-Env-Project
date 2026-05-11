'use strict';

const { sendError } = require('../utils/response');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.context?.key || 'unknown',
        message: d.message,
      }));
      return sendError(res, 422, 'Validation failed.', errors);
    }

    req[source] = value;
    next();
  };
};

module.exports = validate;
