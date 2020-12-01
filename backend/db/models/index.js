const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const SequelizePaperTrail = require('sequelize-paper-trail');
const loadEnvironementVariables = require('../../utils/env');

loadEnvironementVariables();

const db = {models: {}};
const basename = path.basename(__filename);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.DEBUG_MODE ? console.log : false,
});

const options = {};

const PaperTrail = SequelizePaperTrail.init(sequelize, options || {});
PaperTrail.defineModels();

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db.models[model.name] = model;
  });

Object.keys(db.models).forEach(async (modelName) => {
  if (db.models[modelName].associate) {
    await db.models[modelName].associate(db.models);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
