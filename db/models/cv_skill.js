'use strict';

const uuid = require("uuid/v4");

module.exports = (sequelize, DataTypes) => {
  const CV_Skill = sequelize.define('CV_Skill', {
    CVid: DataTypes.UUID,
    name: DataTypes.STRING
  }, {});
  CV_Skill.beforeCreate((cv_skill, _ ) => {
    return cv_skill.id = uuid();
  });
  CV_Skill.associate = function(models) {
    // associations can be defined here
  };
  return CV_Skill;
};