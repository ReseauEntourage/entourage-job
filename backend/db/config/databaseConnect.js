const dotenv = require('dotenv');

dotenv.config();

const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL);

module.exports = db;

db.authenticate()
  .then(() => {
    console.log('Connecté à la base de données');
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données : ', err);
  });
