/**
 * Not-found error handler.
 *
 * @module error-handlers/404
 */

'use strict';

/**
 * Sends a JSON response when no application route matches the request.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} The Express response.
 */
function notFoundHandler(req, res) {
  return res.status(404).json({
    status: 404,
    message: 'Not Found',
  });
}

module.exports = notFoundHandler;
