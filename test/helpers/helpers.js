const Sequelize = require('sequelize');
const server = require('../../backend/server');
const loadEnvironnementVariables = require('../../backend/utils/env');



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
    db.authenticate()
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
const createData = async (factory, n) => {
    const entityArray = [];
    // TODO: should run a factory n times
    // Promise.all

    return entityArray
}

module.exports = {
    startTestServer,
    stopTestServer,
    recreateTestDB,
    resetTestDB,
    createData,
};