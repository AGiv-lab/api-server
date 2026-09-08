/**
 * Application entry point.
 *
 * @module index
 */

'use strict';

require('dotenv').config();

const server = require('./src/server.js');
const { sequelize, connect } = require('./src/models');

async function main() {
  try {
    await connect();
    await sequelize.sync();
    server.start(process.env.PORT || 3000);
  } catch (error) {
    console.error('Database startup failed:', error.message);
    await sequelize.close();
    process.exitCode = 1;
  }
}

main();
