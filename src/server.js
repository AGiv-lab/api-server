/**
 * Express application configuration and startup utilities.
 *
 * @module server
 */

'use strict';

const express = require('express');
const logger = require('./middleware/logger.js');
const validator = require('./middleware/validator.js');
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const instrumentsRouter = require('./routes/instruments.js');
const moviesRouter = require('./routes/movies.js');

const app = express();

app.use(logger);
app.use(express.json());

/**
 * Responds with the validated person's name.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} The Express response.
 */
function getPerson(req, res) {
  return res.status(200).json({ name: req.query.name });
}

app.get('/person', validator, getPerson);
app.use('/instruments', instrumentsRouter);
app.use('/movies', moviesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Starts the HTTP server on the supplied port.
 *
 * @param {number|string} port - Port on which the server should listen.
 * @returns {import('http').Server} The running HTTP server.
 */
function start(port) {
  const httpServer = app.listen(port);
  console.log(`Server is listening on port ${port}`);
  return httpServer;
}

module.exports = { app, start };
