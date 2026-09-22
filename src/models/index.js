'use strict';

require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const defineInstrument = require('./instrument.js');
const defineMovie = require('./movie.js');

const databaseUrl = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;

// Construction does not connect; startup and integration tests authenticate explicitly.
const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, { dialect: 'postgres', logging: false })
  : new Sequelize({ dialect: 'postgres', logging: false });

const Instrument = defineInstrument(sequelize, DataTypes);
const Movie = defineMovie(sequelize, DataTypes);

Movie.hasMany(Instrument, { foreignKey: 'movieId' });
Instrument.belongsTo(Movie, { foreignKey: 'movieId' });

async function connect() {
  if (!databaseUrl) {
    throw new Error('Set DATABASE_URL (or TEST_DATABASE_URL for tests)');
  }
  await sequelize.authenticate();
}

module.exports = { sequelize, Instrument, Movie, connect };
