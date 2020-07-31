const Sequelize = require('sequelize');
const loadEnvironnementVariables = require('../../backend/utils/env');

const server = require('../../backend/server');

let app;
let db;

/**
 * Start a server according to .env variables
 */
const startTestServer = async () => {
    loadEnvironnementVariables();
    app = server.prepare();
    server.start(process.env.PORT);
    return app;
}

/**
 * stop the server
 */
const stopTestServer = async () => {
    server.close()
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
 * Drops all the tables content
 */
const resetTestDB = async () => {
    console.log('::::::::::: RESET DB ::::::::::::::::')
    await db.query('DELETE FROM "Users"');
    await db.query('DELETE FROM "User_Candidats"');

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
const createEntities = async (factory, props = {}, n) => {
    return Promise.all(Array(n).fill(0).map(() => factory(props)))
        .catch((e) => console.error(e));
}

module.exports = {
    startTestServer,
    stopTestServer,
    recreateTestDB,
    resetTestDB,
    createEntities,
    app,
}
