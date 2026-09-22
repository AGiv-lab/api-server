'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('Instrument', {
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  mood: DataTypes.STRING,
}, { timestamps: false });
