const request = require('supertest');
const {
    startTestServer,
    recreateTestDB,
    resetTestDB,
    stopTestServer,
    createLoggedInUser,
} = require("./helpers");
const userFactory = require("./factories/userFactory");
const { USER_ROLES } = require("../constants");

describe('Auth', () => {
    const route = '/api/v1/auth';
    let serverTest;
    let candidat;
    let candidatInfo;
    let loggedInCandidat;
    let unknownUser;
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxheW5lX2JhaHJpbmdlckBob3RtYWlsLmNvbSIsImlkIjoiMWM0NzI0MzEtZTg4NS00MGVhLWI0MWEtMjA1M2RlODJhZDJlIiwiZmlyc3ROYW1lIjoiT2N0YXZpYSIsImxhc3ROYW1lIjoiWXVuZHQiLCJwaG9uZSI6IjI2Mi0wMzItOTY2NCB4NzY5NCIsImdlbmRlciI6MCwicm9sZSI6IkNhbmRpZGF0IiwiZXhwIjoxNjAzNDM3OTE4LCJjYW5kaWRhdElkIjpudWxsLCJjb2FjaElkIjpudWxsLCJpYXQiOjE1OTgyNTM5MTh9.TrUmF20O7TJR2NwqjyyJJvEoBjs59Q3ClqX6PEHUsOw';

    beforeAll(async () => {
        serverTest = await startTestServer();
        await recreateTestDB();
        unknownUser = await userFactory(
            {
                role: USER_ROLES,
                password: 'unknownUser'
            },
            false
        );
        loggedInCandidat = await createLoggedInUser({
            role: USER_ROLES.CANDIDAT,
            password: 'loggedInCandidat',
        });
        console.log('logged in user', loggedInCandidat)
    });
    beforeEach(async () => {
        candidat = await userFactory({
            role: USER_ROLES.CANDIDAT,
            password: 'candidat',
        });
        candidatInfo = {
            ...candidat
        }
        delete candidatInfo.createdAt;
        delete candidatInfo.hashReset;
        delete candidatInfo.lastConnection;
        delete candidatInfo.password;
        delete candidatInfo.salt;
        delete candidatInfo.saltReset;
        delete candidatInfo.updatedAt;
    });
    afterAll(async () => {
        await resetTestDB();
        await stopTestServer();
    });
    describe.skip('Login - login/', () => {
        it('Should return 200 and user\'s info with token, if valid email and password', async () => {
            const response = await request(serverTest)
                .post(`${route}/login`)
                .send({
                    email: candidat.email,
                    password: 'candidat',
                });
            expect(response.status).toBe(200);
            expect(response.body.user).toMatchObject(candidatInfo);
            expect(response.body.user.token).toBeTruthy();
        });
        it('Should return 400, if invalid email', async () => {
            const response = await request(serverTest)
                .post(`${route}/login`)
                .send({
                    email: 'invalidEmail',
                    password: 'candidat',
                });
            expect(response.status).toBe(400);
        });
        it('Should return 400, if invalid password', async () => {
            const response = await request(serverTest)
                .post(`${route}/login`)
                .send({
                    email: candidat.email,
                    password: 'invalidPassword',
                });
            expect(response.status).toBe(400);
        });
        it('Should return 422, if no email', async () => {
            const response = await request(serverTest)
                .post(`${route}/login`)
                .send({
                    password: 'candidat',
                });
            expect(response.status).toBe(422);
        });
        it('Should return 422, if no password', async () => {
            const response = await request(serverTest)
                .post(`${route}/login`)
                .send({
                    email: candidat.email,
                });
            expect(response.status).toBe(422);
        });
    });
    describe.skip('Logout - logout/', () => {
        // TODO: Rediretion or logout?
        it(`Should logout the user`, async () => {
            await request(serverTest)
                .post(`${route}/logout`)
                .set('authorization', `Token ${loggedInCandidat.token}`);

            const response = await request(serverTest)
                .get(`/api/v1/user/candidat`)
                .set('authorization', `Token ${loggedInCandidat.token}`)
                .query({
                    candidatId: loggedInCandidat.user.id
                });
            expect(response.status).toBe(401);
        });
    });
    describe('Forgot - forgot/', () => {
        it('Should return 422; if no user email provided', async () => {
            const response = await request(serverTest)
                .post(`${route}/forgot`)
            expect(response.status).toBe(422);
            expect(response.body).toMatchObject({
                errors: {
                    email: 'is required',
                },
            });
        });
        it('Should return 404; if invalid user email provided', async () => {
            const response = await request(serverTest)
                .post(`${route}/forgot`)
                .send({
                    email: 'invalid@nowhere.nothing',
                });
            expect(response.status).toBe(404);
        });
        it('Should return 200 and send email, if valid user email provided', async () => {
            const response = await request(serverTest)
                .post(`${route}/forgot`)
                .send({
                    email: candidat.email,
                });
            expect(response.status).toBe(200);
        });
    });
    describe('reset - reset/:userId/:token', () => {
        describe('Verify password reinitialisation link', () => {
            it('Should return 200 and a string, if valid link', async () => {
                await request(serverTest)
                    .post(`${route}/forgot`)
                    .send({
                        email: loggedInCandidat.user.email
                    });
                const response = await request(serverTest)
                    .post(`${route}/reset/${loggedInCandidat.user.id}/${loggedInCandidat.token}`)
                    .send({
                        newPassword: 'newPassword',
                        confirmPassword: 'newPassword'
                    });
                expect(response.status).toBe(200);
            });
            it('Should return 400, if not matching passwords', async () => {
                const response = await request(serverTest)
                    .post(`${route}/reset/${loggedInCandidat.user.id}/${loggedInCandidat.token}`)
                    .send({
                        newPassword: 'newPassword',
                        confirmPassword: 'Password'
                    });
                expect(response.status).toBe(400);
            });
            // it('Should return 401, if invalid user id', async () => {
            //     const response = await request(serverTest)
            //         .post(`${route}/reset/${unknownUser.id}/${loggedInCandidat.token}`)
            //         .send({
            //             newPassword: 'newPassword',
            //             confirmPassword: 'newPassword'
            //         });
            //     console.log(response.status);
            //     expect(response.status).toBe(401);
            // });
            // it('Should return 401 if invalid user token', async () => {
            //     const response = await request(serverTest)
            //         .post(`${route}/reset/${loggedInCandidat.user.id}/${invalidToken}`)
            //         .send({
            //             newPassword: 'newPassword',
            //             confirmPassword: 'newPassword'
            //         });
            //     expect(response.status).toBe(401);
            // });
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