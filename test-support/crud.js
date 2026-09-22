'use strict';

const request = require('supertest');
const { app } = require('../src/server');
const { sequelize, connect } = require('../src/models');

module.exports = function crudTests(path, Model, initial, changes) {
  describe(path, () => {
    let id;
    const ids = [];
    beforeAll(async () => {
      await connect();
      await sequelize.sync();
    });
    afterAll(async () => {
      try {
        if (ids.length) await Model.destroy({ where: { id: ids } });
      } finally {
        await sequelize.close();
      }
    });

    test('POST returns 201, allowed data and a generated ID', async () => {
      const response = await request(app).post(path).send({ ...initial, id: 2147483647, extra: 'ignored' });
      id = response.body.id;
      if (id) ids.push(id);
      expect(response.status).toBe(201);
      expect(id).toEqual(expect.any(Number));
      expect(id).not.toBe(2147483647);
      expect(response.body).toEqual({ id, ...initial });
    });

    test('GET collection returns 200 and an array containing the record', async () => {
      const response = await request(app).get(path);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toContainEqual({ id, ...initial });
    });

    test('GET ID returns only the requested record', async () => {
      const response = await request(app).get(`${path}/${id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id, ...initial });
    });

    test('PUT saves allowed changes and preserves omitted fields and ID', async () => {
      const response = await request(app).put(`${path}/${id}`).send({ ...changes, id: 2147483647, extra: 'ignored' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id, ...initial, ...changes });
      const saved = await request(app).get(`${path}/${id}`);
      expect(saved.status).toBe(200);
      expect(saved.body).toEqual(response.body);
    });

    test('DELETE returns 204 and removes the record', async () => {
      const response = await request(app).delete(`${path}/${id}`);
      expect(response.status).toBe(204);
      expect(response.text).toBe('');
      expect((await request(app).get(`${path}/${id}`)).status).toBe(404);
      expect((await request(app).get(path)).body.some(record => record.id === id)).toBe(false);
    });

    test.each(['get', 'put', 'delete'])('%s missing ID returns the existing 404 JSON', async method => {
      const response = await request(app)[method](`${path}/${id}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ status: 404, message: 'Not Found' });
    });

    test.each(['abc', '0', '-1', '999999999999999999999'])('invalid ID %s returns 404', async invalid => {
      expect((await request(app).get(`${path}/${invalid}`)).status).toBe(404);
    });

    test('unsupported method returns 404', async () => {
      const response = await request(app).patch(path).send(initial);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ status: 404, message: 'Not Found' });
    });

    test('database errors reach the existing 500 handler', async () => {
      const spy = jest.spyOn(Model, 'findAll').mockRejectedValueOnce(new Error('Database unavailable'));
      try {
        const response = await request(app).get(path);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: 500, message: 'Database unavailable' });
      } finally {
        spy.mockRestore();
      }
    });
  });
};
