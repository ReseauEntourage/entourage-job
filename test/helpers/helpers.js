import loadEnvironnementVariables from '../../backend/utils/env';

const Sequelize = require('sequelize');
const server = require('../../backend/server');

/**
 * Start a server according to .env variables
 */
const startTestServer = async () => {
    loadEnvironnementVariables();
    server.prepare();
    server.start(process.env.PORT);
}

/**
 * stop the server
 */
const stopTestServer = async () => {
    server.close()
}

/**
 * Create a test database accoding to env variables
 * @returns the db connection
 */
const recreateTestDB = async () => {
    loadEnvironnementVariables();
    const db = new Sequelize(
        process.env.DATABASE_URL,
        {
            logging: process.env.DEBUG_MODE ? console.log : false,
        }
    );

    await db.authenticate()
        .then(() => {
            console.log('Connecté à la base de données');
        })
        .catch((err) => {
            console.error('Impossible de se connecter à la base de données : ', err);
        });

    return db;
};

/**
 * Drops all the tables content
 */
const resetTestDB = async () => {
    Sequelize.drop();
}

/**
 * Create many entities using a factory
 * @param {An Entity factory} factory an entity factory
 * @param {*} n the number of entities to create
 * @returns
 */
const createMany = async (factory, n) => {
    return Promise.all(Array(n).fill(0).map(factory))
        .catch((e) => console.error(e));
}

module.exports = {
    startTestServer,
    stopTestServer,
    recreateTestDB,
    resetTestDB,
    createMany,
};