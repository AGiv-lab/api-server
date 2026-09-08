'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('Movie', {
  title: DataTypes.STRING,
  genre: DataTypes.STRING,
  year: DataTypes.INTEGER,
}, { timestamps: false });
