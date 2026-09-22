'use strict';

const request = require('supertest');
const { app } = require('../src/server');
const { sequelize, connect, Movie, Instrument } = require('../src/models');

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Movie instruments', () => {
  const movieIds = [];
  const instrumentIds = [];

  beforeAll(async () => {
    await connect();
    await sequelize.sync();
  });

  afterAll(async () => {
    try {
      await Instrument.destroy({ where: { id: instrumentIds } });
      await Movie.destroy({ where: { id: movieIds } });
    } finally {
      await sequelize.close();
    }
  });

  async function createMovie(title) {
    const response = await request(app).post('/movies').send({ title, genre: 'Drama', year: 2024 });
    if (response.body.id) movieIds.push(response.body.id);
    expect(response.status).toBe(201);
    return response.body;
  }

  async function createInstrument(movieId) {
    const data = { name: 'Piano', type: 'Keyboard', mood: 'Reflective', movieId };
    const response = await request(app).post('/instruments').send({ ...data, brand: 'ignored' });
    if (response.body.id) instrumentIds.push(response.body.id);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: expect.any(Number), ...data });
    return response.body;
  }

  test('returns only instruments belonging to the requested movie', async () => {
    const movie = await createMovie('First movie');
    const otherMovie = await createMovie('Other movie');
    const first = await createInstrument(movie.id);
    const second = await createInstrument(movie.id);
    await createInstrument(otherMovie.id);
    await createInstrument(null);

    const response = await request(app).get(`/movies/${movie.id}/instruments`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(expect.arrayContaining([first, second]));

    const saved = await Instrument.findByPk(first.id);
    expect((await saved.getMovie()).id).toBe(movie.id);
  });

  test('PUT can associate an instrument with a movie and later remove the association', async () => {
    const movie = await createMovie('New association');
    const instrument = await createInstrument(null);
    const response = await request(app).put(`/instruments/${instrument.id}`).send({ movieId: movie.id });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...instrument, movieId: movie.id });
    const related = await request(app).get(`/movies/${movie.id}/instruments`);
    expect(related.status).toBe(200);
    expect(related.body).toEqual([response.body]);

    const removed = await request(app).put(`/instruments/${instrument.id}`).send({ movieId: null });
    expect(removed.status).toBe(200);
    expect(removed.body).toEqual(instrument);
    expect((await request(app).get(`/movies/${movie.id}/instruments`)).body).toEqual([]);
  });

  test('returns 200 and an empty array for a movie without instruments', async () => {
    const movie = await createMovie('No instruments');
    const response = await request(app).get(`/movies/${movie.id}/instruments`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('returns the existing 404 JSON for a nonexistent movie', async () => {
    const movie = await createMovie('Deleted movie');
    expect((await request(app).delete(`/movies/${movie.id}`)).status).toBe(204);
    const response = await request(app).get(`/movies/${movie.id}/instruments`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ status: 404, message: 'Not Found' });
  });

  test.each(['abc', '0', '-1', '999999999999999999999'])('returns 404 for invalid movie ID %s', async id => {
    const response = await request(app).get(`/movies/${id}/instruments`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ status: 404, message: 'Not Found' });
  });

  test('relationship query errors reach the existing 500 handler', async () => {
    const movie = await createMovie('Query error');
    const spy = jest.spyOn(Movie.prototype, 'getInstruments').mockRejectedValueOnce(new Error('Database unavailable'));
    try {
      const response = await request(app).get(`/movies/${movie.id}/instruments`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ status: 500, message: 'Database unavailable' });
    } finally {
      spy.mockRestore();
    }
  });
});
