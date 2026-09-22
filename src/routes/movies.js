'use strict';

const express = require('express');
const { Movie } = require('../models');
const Collection = require('../models/collection');
const router = express.Router();

const moviesCollection = new Collection(Movie);

// Select only model fields; IDs always come from PostgreSQL.
function fields(body = {}) {
  const values = {};
  for (const key of ['title', 'genre', 'year']) {
    if (Object.prototype.hasOwnProperty.call(body, key)) values[key] = body[key];
  }
  return values;
}

router.post('/', async (req, res, next) => {
  try {
    const record = await moviesCollection.create(fields(req.body));
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await moviesCollection.read());
  } catch (error) {
    next(error);
  }
});

router.param('id', async (req, res, next, id) => {
  try {
    if (!/^[1-9]\d*$/.test(id) || Number(id) > 2147483647) return next('route');
    const record = await moviesCollection.read(id);
    if (!record) return next('route');
    req.movie = record;
    next();
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.movie);
});

router.get('/:id/instruments', async (req, res, next) => {
  try {
    res.status(200).json(await req.movie.getInstruments());
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const record = await moviesCollection.update(req.params.id, fields(req.body));
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await moviesCollection.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
