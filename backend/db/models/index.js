const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const SequelizePaperTrail = require('sequelize-paper-trail');
const loadEnvironementVariables = require('../../utils/env');

loadEnvironementVariables();

const db = { models: {} };
const basename = path.basename(__filename);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.DEBUG_MODE ? console.log : false,
});

const options = {
  enableRevisionChangeModel: true,
  enableMigration: true,
  // Doesn't seem to work
  // enableCompression: true,
  UUID: true,
  // debug: true,
};

const PaperTrail = SequelizePaperTrail.init(sequelize, options || {});
PaperTrail.defineModels(db.models);

// Fix to sync the database with the newly created Models by SequelizePaperTrail
db.models.Revision.sync()
  .then(() => {
    console.log('Revision Model synced');
  })
  .catch((err) => {
    console.error('Revision Model failed to sync : ', err);
  });

db.models.RevisionChange.sync()
  .then(() => {
    console.log('RevisionChange Model synced');
  })
  .catch((err) => {
    console.error('RevisionChange Model failed to sync : ', err);
  });

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
    // Condition to fix error with Revision and the User model association being 'false' when options.userModel is not defined
    if (modelName !== 'Revision') {
      await db.models[modelName].associate(db.models);
    }
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
