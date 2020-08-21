const { startTestServer, recreateTestDB, resetTestDB, stopTestServer } = require("./helpers");
const userFactory = require("./factories/userFactory");
const { USER_ROLES } = require("../constants");

describe('Auth', () => {
    const route = '/api/v1/auth';
    let serverTest;
    let candidat;

    beforeAll(async () => {
        serverTest = await startTestServer();
        await recreateTestDB();
        candidat = await userFactory({
            role: USER_ROLES.CANDIDAT,
            password: 'candidat'
        });
    });
    afterAll(async () => {
        await resetTestDB();
        await stopTestServer();
    });
    describe('Login - login/', () => {
        it('Should return 200 and user\'s info with token, if valid email and password', async () => {

        });
        it('Should return 422, if invalid email', async () => {

        });
        it('Should return 422, if invalid password', async () => {

        });
    });
    describe('Logout - logout/', () => {
        it(`Should redirect to ${process.env.SERVER_URL}`, async () => {

        });
    });
    describe('Forgot - forgot/', () => {
        it('Should return 200 and send email, if valid user email provided', () => {

        });
        it('Should return 401, if invalid user email provided', () => {

        });
    });
    describe('reset - reset/:userId/:token', () => {
        describe('Verify password reinitialisation link', () => {
            it('Should return 403, if invalid link', async () => {

            });
            it('Should return 200 and a string, if valid link', async () => {

            });
        });
        describe('Password reinitialisation', () => {
            it('Should return 200 and updated user', async () => {

            })
            it('Should return 401', async () => {

            });
        });
    });
    describe('Current - /current', () => {
        it('Should return a user with token if valid user id provided', async () => {

        });
        it('Should return 400, if invalid user id provided', async () => {

        });
    });
})