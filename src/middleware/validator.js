/**
 * Query-string validation middleware.
 *
 * @module middleware/validator
 */

'use strict';

/**
 * Requires a name query parameter before continuing.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express callback for the next middleware or an error.
 * @returns {void}
 */
function validator(req, res, next) {
  if (!req.query.name) {
    next(new Error('Name is required'));
    return;
  }

  next();
}

module.exports = validator;
