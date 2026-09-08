'use strict';

const crudTests = require('../test-support/crud');
const { Movie } = require('../src/models');

crudTests('/movies', Movie, { title: 'Arrival', genre: 'Science Fiction', year: 2016 }, { title: 'Dune', year: 2021 });
