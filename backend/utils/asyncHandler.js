/**
 * Wraps an async route handler and forwards any rejected promise to Express's
 * error-handling middleware, removing the need for try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
