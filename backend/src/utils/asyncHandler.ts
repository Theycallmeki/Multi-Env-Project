/**
 * Wraps an asynchronous function to catch any errors and pass them to the next middleware.
 * Eliminates the need for try-catch blocks in every controller method.
 * 
 * @param {Function} fn - The asynchronous function to wrap.
 * @returns {Function} - The wrapped function.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
