const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

/**
 * Runs after a set of express-validator chains. If any failed, returns a
 * 422 with the list of field errors in the standard response shape.
 */
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  return sendError(res, {
    statusCode: 422,
    message: 'Validation failed',
    errors,
  });
};

module.exports = validate;
