/**
 * Integration tests for the Express application.
 *
 * @module tests/server
 */

'use strict';

const request = require('supertest');
const { app, start } = require('../src/server.js');

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Express server', () => {
  test('returns 404 JSON for an unknown route', async () => {
    const response = await request(app).get('/missing');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ status: 404, message: 'Not Found' });
  });

  test('returns 404 JSON for an unsupported method', async () => {
    const response = await request(app).post('/person?name=Ada');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ status: 404, message: 'Not Found' });
  });

  test('returns 500 when name is missing', async () => {
    const response = await request(app).get('/person');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ status: 500, message: 'Name is required' });
  });

  test('returns 200 and the correct person object for fred', async () => {
    const response = await request(app).get('/person?name=fred');

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({ name: 'fred' });
  });

  test('starts the app through its exported start function without a real port', () => {
    const fakeServer = { close: jest.fn() };
    const listen = jest.spyOn(app, 'listen').mockReturnValue(fakeServer);

    expect(start(3000)).toBe(fakeServer);
    expect(listen).toHaveBeenCalledWith(3000);

    listen.mockRestore();
  });
});
