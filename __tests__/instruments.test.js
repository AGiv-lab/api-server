'use strict';

const crudTests = require('../test-support/crud');
const { Instrument } = require('../src/models');

crudTests('/instruments', Instrument, { name: 'Stratocaster', type: 'Guitar', brand: 'Fender' }, { name: 'Telecaster' });
