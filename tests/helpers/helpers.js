import { startServer, closeServer, prepareServer } from 'src/server';

import Sequelize from 'sequelize';

let app;
let db;

/**
 * Start a server according to .env variables
 */
const startTestServer = async () => {
  app = prepareServer();
  await startServer();
  return app;
};

/**
 * stop the server
 */
const stopTestServer = async () => {
  await closeServer();
  await db.close();
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

  // await Sequelize.truncate({
  //   force: true
  // });
};

/**
 * Create a test database according to env variables
 *
 * @returns the db connection
 */
const recreateTestDB = async () => {
  db = new Sequelize(process.env.DATABASE_URL, {
    logging: process.env.DEBUG_MODE ? console.log : false,
  });
  await resetTestDB();

  try {
    await db.authenticate();
  } catch (error) {
    console.error('Impossible de se connecter à la base de données : ', error);
  }

  return db;
};

/**
 * Create many entities using a factory
 *
 * @param {function} factory an entity factory
 * @param {number} n the number of entities to create
 * @returns
 */
const createEntities = async (factory, n, props = {}, ...args) => {
  return Promise.all(
    Array(n)
      .fill(0)
      .map(() => {
        return factory(props, ...args);
      })
  ).catch((e) => {
    return console.error(e);
  });
};

const getApp = () => {
  return app;
};

export {
  startTestServer,
  stopTestServer,
  recreateTestDB,
  resetTestDB,
  createEntities,
  getApp,
};