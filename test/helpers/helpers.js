const Sequelize = require('sequelize');
const request = require('supertest');
const loadEnvironnementVariables = require('../../backend/utils/env');

const server = require('../../backend/server');
const userFactory = require('../factories/userFactory');
const { USER_ROLES } = require('../../constants');

let app;
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
 * Create a test database accoding to env variables
 * @returns the db connection
 */
const recreateTestDB = async () => {
    loadEnvironnementVariables();
    console.log('DB URL: ', process.env.DATABASE_URL);
    const db = new Sequelize(
        process.env.DATABASE_URL,
        {
            logging: process.env.DEBUG_MODE ? console.log : false,
        }
    );

    try {
        await db.authenticate()
        console.log('Connecté à la base de données');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données : ', error);
    }

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
const createEntities = async (factory, props = {}, n) => {
    return Promise.all(Array(n).fill(0).map(() => factory(props)))
        .catch((e) => console.error(e));
}

const getToken = async (user) => {
    const response = await request(app)
        .post(`/api/v1/auth/login`)
        .send({
            email: user.email,
            password: user.password,
        })
        .expect(res => res.body != null);
    if (response.status !== 200) {
        console.error('Token couldn\'t be fetched', JSON.stringify(response.body));
        throw new Error('Token couldn\'t be fectched');
    }

    return response.body.token;
}

const getLoggedInUser = async (props = {}) => {
    const admin = userFactory(props);
    const token = await getToken(admin);

    return { token, admin }
}


module.exports = {
    startTestServer,
    stopTestServer,
    recreateTestDB,
    resetTestDB,
    createEntities,
    getLoggedInUser,
};