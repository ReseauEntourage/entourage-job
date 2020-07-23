const request = require('supertest');
const userFactory = require('./factories/userFactory');
const {
    startTestServer,
    recreateTestDB,
    stopTestServer,
    resetTestDB,
    getLoggedInUser,
} = require('./helpers/helpers');
const { USER_ROLES } = require('../constants');

let serverTest;
let re

describe('User', () => {
    beforeAll(async () => {
        console.log('USER BEFORE ALL');
        serverTest = await startTestServer();

        await recreateTestDB();
        // await userFactory().then((user) => console.log('USER FACTORY', user));
        // await createEntities(userFactory(), {}, 5).then((user) => console.log('MANY MANY MANY', user));
    });
    afterAll(async () => {
        resetTestDB();
        stopTestServer();
    });
    describe('CRUD User', () => {
        describe('C - Create 1 User', () => {

            it('Should reutrn unauthorized if user is not logged.', async () => {
                const candidat = userFactory({ role: USER_ROLES.CANDIDAT }, false);
                const response = await request(serverTest)
                    .post(`/api/v1/user`)
                    .send(candidat);
                expect(response.status).toBe(401);
            });

            it('Should return unauthorized if the user is not an administrator.', async () => {
                const loggedInUser = getLoggedInUser({
                    role: USER_ROLES.COACH,
                    password: 'coach',
                });
                const candidat = userFactory({ role: USER_ROLES.CANDIDAT }, false);
                const response = await request(serverTest)
                    .post(`/api/v1/user`)
                    .set('authorization', `Token ${loggedInUser.token}`)
                    .send(candidat);
                expect(response.status).toBe(401);
            });

            it('Should return the created user', async () => {
                const loggedInAdmin = getLoggedInUser({
                    role: USER_ROLES.ADMIN,
                    password: 'admin',
                });
                const candidat = userFactory({ role: USER_ROLES.CANDIDAT }, false);
                const response = await request(serverTest)
                    .post(`/api/v1/user`)
                    .set('authorization', `Token ${loggedInAdmin.token}`)
                    .send(candidat);
                expect(response.status).toBe(200);
            });

            it('Should return conflict if email already exist', () => {

            });
        });

        describe.skip('R - Read 1 User', () => {

        });

        describe.skip('U - Update 1 User', () => {

        });

        describe.skip('D - Delete 1 User', () => {

        });
    });




});
