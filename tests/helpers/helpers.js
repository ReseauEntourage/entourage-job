import loadEnvironementVariables from 'src/utils/env';

loadEnvironementVariables();

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
  await db.query('DELETE FROM "CV_Skills"');
  await db.query('DELETE FROM "CV_Searches"');
  await db.query('DELETE FROM "CV_Passions"');
  await db.query('DELETE FROM "CV_Locations"');
  await db.query('DELETE FROM "CV_Ambitions"');
  await db.query('DELETE FROM "CV_Contracts"');
  await db.query('DELETE FROM "CV_Languages"');
  await db.query('DELETE FROM "CV_BusinessLines"');
  await db.query('DELETE FROM "Opportunity_Users"');
  await db.query('DELETE FROM "Opportunity_BusinessLines"');
  await db.query('DELETE FROM "User_Candidats"');
  await db.query('DELETE FROM "Experience_Skills"');
  await db.query('DELETE FROM "Experiences"');

  await db.query('DELETE FROM "Users"');
  await db.query('DELETE FROM "Skills"');
  await db.query('DELETE FROM "Shares"');
  await db.query('DELETE FROM "SequelizeMeta"');
  await db.query('DELETE FROM "Revisions"');
  await db.query('DELETE FROM "RevisionChanges"');
  await db.query('DELETE FROM "Reviews"');
  await db.query('DELETE FROM "Passions"');
  await db.query('DELETE FROM "Locations"');
  await db.query('DELETE FROM "Languages"');
  await db.query('DELETE FROM "Ambitions"');
  await db.query('DELETE FROM "BusinessLines"');
  await db.query('DELETE FROM "Contracts"');

  await db.query('DELETE FROM "CVs"');

  await db.query('DELETE FROM "Opportunities"');

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
