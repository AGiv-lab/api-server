/**
 * Unit tests for request logging middleware.
 *
 * @module tests/logger
 */

'use strict';

const logger = require('./logger.js');

describe('logger middleware', () => {
  test('logs the request method and path and calls next', () => {
    const request = { method: 'GET', path: '/person' };
    const next = jest.fn();
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger(request, {}, next);

    expect(log).toHaveBeenCalledWith('GET /person');
    expect(next).toHaveBeenCalledTimes(1);

    log.mockRestore();
  });
});
