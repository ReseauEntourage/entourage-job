'use strict';

const uuid = require("uuid/v4");

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    job: DataTypes.STRING,
    businessLine: DataTypes.STRING,
    company: DataTypes.STRING,
    localization: DataTypes.STRING,
    message: DataTypes.TEXT
  }, {});
  Message.beforeCreate((message, _) => {
    return message.id = uuid();
  });
  Message.associate = function (models) {
    // associations can be defined here
  };
  return Message;
};