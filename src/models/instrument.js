'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('Instrument', {
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  brand: DataTypes.STRING,
}, { timestamps: false });
