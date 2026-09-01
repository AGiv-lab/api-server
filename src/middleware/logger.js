/**
 * Request logging middleware.
 *
 * @module middleware/logger
 */

'use strict';

/**
 * Logs the HTTP method and request path before continuing the middleware chain.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express callback for the next middleware.
 * @returns {void}
 */
function logger(req, res, next) {
  console.log(`${req.method} ${req.path}`);
  next();
}

module.exports = logger;
