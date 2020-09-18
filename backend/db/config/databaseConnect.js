const Sequelize = require('sequelize');
const loadEvironementVariables = require('../../utils/env');

loadEvironementVariables();

const db = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.DEBUG_MODE ? console.log : false,
});

module.exports = db;


db.authenticate()
  .then(() => {
    console.log('Connecté à la base de données');
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données : ', err);
  });
