/**
 * Internal server error handler.
 *
 * @module error-handlers/500
 */

'use strict';

/**
 * Converts application errors to a JSON 500 response.
 *
 * @param {Error} error - Error passed through the Express middleware chain.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express callback retained for error-handler signature.
 * @returns {object} The Express response.
 */
function errorHandler(error, req, res, next) {
  return res.status(500).json({
    status: 500,
    message: error.message,
  });
}

module.exports = errorHandler;
