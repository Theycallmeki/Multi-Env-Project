'use strict';

const { sendError } = require('../utils/response');

/**
 * Returns an Express middleware that validates req.body against a Joi schema.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), register);
 *
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @param {'body'|'query'|'params'} [source='body'] - Request property to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,   // collect ALL errors, not just the first one
      stripUnknown: true,  // remove fields not defined in schema
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.context?.key || 'unknown',
        message: d.message,
      }));
      return sendError(res, 422, 'Validation failed.', errors);
    }

    // Replace req[source] with the sanitized + coerced value from Joi
    req[source] = value;
    next();
  };
};

module.exports = validate;
