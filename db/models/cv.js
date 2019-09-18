'use strict';

const uuid = require("uuid/v4");

module.exports = (sequelize, DataTypes) => {
  const CV = sequelize.define('CV', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    intro: DataTypes.TEXT,
    contract: DataTypes.STRING,
    location: DataTypes.STRING,
    story: DataTypes.TEXT,
    status: DataTypes.STRING,
    transport: DataTypes.STRING
  }, {});
  CV.beforeCreate((cv, _) => {
    return cv.id = uuid();
  });
  CV.associate = function (models) {
    CV.hasMany(models.CV_skill, { as: "Skills" })
  };
  return CV;
};