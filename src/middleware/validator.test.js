/**
 * Unit tests for name validation middleware.
 *
 * @module tests/validator
 */

'use strict';

const validator = require('./validator.js');

describe('validator middleware', () => {
  test('calls next without an error when name is present', () => {
    const next = jest.fn();

    validator({ query: { name: 'Ada' } }, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  test('calls next with the required error when name is missing', () => {
    const next = jest.fn();

    validator({ query: {} }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toEqual(new Error('Name is required'));
  });
});
