'use strict';

const express = require('express');
const { Instrument } = require('../models');
const router = express.Router();

// Select only model fields; IDs always come from PostgreSQL.
function fields(body = {}) {
  const values = {};
  for (const key of ['name', 'type', 'brand']) {
    if (Object.prototype.hasOwnProperty.call(body, key)) values[key] = body[key];
  }
  return values;
}

router.post('/', async (req, res, next) => {
  try {
    const record = await Instrument.create(fields(req.body));
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await Instrument.findAll());
  } catch (error) {
    next(error);
  }
});

router.param('id', async (req, res, next, id) => {
  try {
    if (!/^[1-9]\d*$/.test(id) || Number(id) > 2147483647) return next('route');
    const record = await Instrument.findByPk(id);
    if (!record) return next('route');
    req.instrument = record;
    next();
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.instrument);
});

router.put('/:id', async (req, res, next) => {
  try {
    req.instrument.set(fields(req.body));
    await req.instrument.save();
    res.status(200).json(req.instrument);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await req.instrument.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
