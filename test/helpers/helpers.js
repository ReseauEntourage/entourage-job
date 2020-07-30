const Sequelize = require('sequelize');
const request = require('supertest');
const loadEnvironnementVariables = require('../../backend/utils/env');

const server = require('../../backend/server');
const userFactory = require('../factories/userFactory');

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
        process.env.DATABASE_URL,
        {
            logging: process.env.DEBUG_MODE ? console.log : false,
        }
    );

    try {
        await db.authenticate()
    } catch (error) {
        console.error('Impossible de se connecter à la base de données : ', error);
    }
    db.sync({
        force: true,
        logging: console.log
    });
    return db;
};

/**
 * Drops all the tables content
 */
const resetTestDB = async () => {
    console.log('::::::::::: RESET DB ::::::::::::::::')
    db.User.destroy({
        truncate: true,
    });
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

/**
 * Login a user
 * 
 * @param {Object} user 
 * @returns {string} token and id (generated during user creation)
 */
const getTokenAndId = async (user) => {
    const response = await request(app)
        .post(`/api/v1/auth/login`)
        .send({
            email: user.email,
            password: user.password,
        });

    return {
        token: response.body.user.token,
        id: response.body.user.id
    };
}

/**
 * Create a user and get associated token
 * 
 * @param {Object} props user data
 */
const createLoggedInUser = async (props = {}) => {
    const user = await userFactory(props);
    const {
        token,
        id
    } = await getTokenAndId({
        ...user,
        password: props.password
    });

    return {
        token,
        user: {
            ...user,
            id
        }
    };
}


module.exports = {
    startTestServer,
    stopTestServer,
    recreateTestDB,
    resetTestDB,
    createEntities,
    createLoggedInUser,
}
