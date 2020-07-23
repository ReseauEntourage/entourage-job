const request = require('supertest');
const userFactory = require('./factories/userFactory');
const {
    startTestServer,
    recreateTestDB,
    stopTestServer,
    createEntities,
} = require('./helpers/helpers');
const { USER_ROLES } = require('../constants');

let serverTest;

describe('User', () => {
    beforeAll(async () => {
        console.log('USER BEFORE ALL');
        serverTest = await startTestServer();
        await recreateTestDB();
        // await userFactory().then((user) => console.log('USER FACTORY', user));
        // await createEntities(userFactory(), {}, 5).then((user) => console.log('MANY MANY MANY', user));
    });
    afterAll(async () => {
        stopTestServer();
    });
    describe('CRUD User', () => {
        test('Should not create a user without being logged.', async () => {
            const candidat = userFactory({ role: USER_ROLES.CANDIDAT }, false)
            return request(serverTest)
                .post(`/api/v1/user`)
                .send(candidat);
        })
    });
});
