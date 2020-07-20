const dotenv = require('dotenv');
const path = require('path');
const Sequelize = require('sequelize');
const server = require('../../backend/server');

const loadEnvironnementVariables = () => {
    const envPath = process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env';

    dotenv.config({ path: path.resolve(__dirname, envPath) });

}

const startTestServer = async () => {
    loadEnvironnementVariables();
    server.prepare();
    server.start(process.env.PORT);
}

const stopTestServer = async () => {
    server.close()
}

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

const resetTestDB = async () => {
    Sequelize.drop();
}

const createData = async (factory, number) => {
    const entityArray = [];
    // Promise.all
    for (let i = 0; i < number; i += 1) {
        entityArray.push(await factory)
    }

    return entityArray
}

module.exports = {
    startTestServer,
    stopTestServer,
    recreateTestDB,
    resetTestDB,
    createData,
};