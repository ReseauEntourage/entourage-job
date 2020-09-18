const Sequelize = require('sequelize');
const loadEnvironnementVariables = require('../../backend/utils/env');

const server = require('../../backend/server');

let app;
let db;

const PORT = process.env.PORT || 3001;

/**
 * Start a server according to .env variables
 */
const startTestServer = async () => {
  loadEnvironnementVariables();
  app = server.prepare();
  await server.start(PORT);
  return app;
}

/**
 * stop the server
 */
const stopTestServer = async () => {
  await server.close()
  await db.close();
}

/**
 * Create a test database according to env variables
 * 
 * @returns the db connection
 */
const recreateTestDB = async () => {
  loadEnvironnementVariables();
  db = new Sequelize(
    process.env.DATABASE_URL, {
    logging: process.env.DEBUG_MODE ? console.log : false,
  }
  );

  try {
    await db.authenticate()
  } catch (error) {
    console.error('Impossible de se connecter à la base de données : ', error);
  }

  return db;
};

/**
 * Drops all the tables content and close db connection
 *
 */
const resetTestDB = async () => {
  await db.query('DELETE FROM "Users"');
  await db.query('DELETE FROM "User_Candidats"');
  await db.query('DELETE FROM "CVs"');
  await db.query('DELETE FROM "Opportunities"');
  await db.query('DELETE FROM "Opportunity_Users"');

  // await sequelize.truncate({
  //   force: true
  // });
}

/**
 * Create many entities using a factory
 *
 * @param {function} factory an entity factory
 * @param {number} n the number of entities to create
 * @returns
 */
const createEntities = async (factory, n, props = {}, ...args) => {
  return Promise.all(Array(n).fill(0).map(() => factory(props, ...args)))
    .catch((e) => console.error(e));
}

const getApp = () => {
  return app;
}

module.exports = {
  startTestServer,
  stopTestServer,
  recreateTestDB,
  resetTestDB,
  createEntities,
  getApp,
}
