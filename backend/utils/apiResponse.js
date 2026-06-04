/**
 * Standard API response helpers so every endpoint returns the same shape:
 *   success: { success: true, message, data }
 *   error:   { success: false, message, errors? }
 */

const sendSuccess = (res, { statusCode = 200, message = 'Success', data = {} } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, { statusCode = 400, message = 'Something went wrong', errors } = {}) => {
  const payload = {
    success: false,
    message,
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
