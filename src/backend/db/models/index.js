import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import SequelizePaperTrail from 'sequelize-paper-trail';

const models = {};
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
PaperTrail.defineModels(models);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const model = require(path.join(__dirname, file)).default(
      sequelize,
      Sequelize.DataTypes
    );
    models[model.name] = model;
  });

Object.keys(models).forEach(async (modelName) => {
  if (models[modelName].associate) {
    // Condition to fix error with Revision and the User model association being 'false' when options.userModel is not defined
    if (modelName !== 'Revision') {
      await models[modelName].associate(models);
    }
  }
});

export { sequelize, models };
