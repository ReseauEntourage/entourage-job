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
    console.log('server port: ', process.env.PORT);
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
    console.log('DB URL: ', process.env.DATABASE_URL);
    db = new Sequelize(
        process.env.DATABASE_URL, {
        logging: console.log,
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
    db.drop({
        force: true,
        match: "/test$/",
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
 * @returns {string} token
 */
const getToken = async (user) => {
    console.log('GET TOKEN USER MAIL: ', user.email);
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

/**
 * Create a user and get associated token
 * 
 * @param {Object} props user data
 */
const getLoggedInUser = async (props = {}) => {
    console.log('4');

    const user = await userFactory(props);
    console.log('5');

    const token = await getToken(user);
    console.log('6');

    console.log(token, user);

    return {
        token,
        user
    };
}


module.exports = {
    startTestServer,
    stopTestServer,
    recreateTestDB,
    resetTestDB,
    createEntities,
    getLoggedInUser,
}
