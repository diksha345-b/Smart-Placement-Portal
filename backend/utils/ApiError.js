/**
 * Operational error with an attached HTTP status code. Throw this from
 * controllers/services to send a controlled error response through the
 * central error handler.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
