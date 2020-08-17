const request = require('supertest');

const {
    startTestServer,
    recreateTestDB,
    stopTestServer,
    resetTestDB,
    associateCoachAndCandidat,
    createLoggedInUser,
} = require('./helpers');
const cvFactory = require('./factories/cvFactory');
const { USER_ROLES } = require('../constants');
const { CV_STATUS } = require('../constants');
const userFactory = require('./factories/userFactory');


describe('CV', () => {
    const route = '/api/v1/cv';
    let serverTest;
    let loggedInAdmin;
    let loggedInCandidat;
    let loggedInCoach;
    beforeAll(async () => {
        serverTest = await startTestServer();
        await recreateTestDB();
        const admin = await userFactory({
            role: USER_ROLES.ADMIN,
            password: 'admin',
        });
        const coach = await userFactory({
            role: USER_ROLES.COACH,
            password: 'coach',
        });
        const candidat = await userFactory({
            role: USER_ROLES.CANDIDAT,
            password: 'candidat',
        });
        admin.password = 'admin';
        coach.password = 'coach';
        candidat.password = 'candidat';
        await associateCoachAndCandidat(coach, candidat);
        loggedInAdmin = await createLoggedInUser(admin, false);
        loggedInCoach = await createLoggedInUser(coach, false);
        loggedInCandidat = await createLoggedInUser(candidat, false);
    });

    afterAll(async () => {
        await resetTestDB();
        await stopTestServer();
    });
    describe('CRUD CV', () => {
        describe('C - Create 1 CV', () => {
            it('Should return 200 and CV if logged in user', async () => {
                const cv = await cvFactory(
                    {
                        UserId: loggedInCandidat.user.id,
                        urlImg: null,
                    },
                    {},
                    false
                );
                const cvResponse = { ...cv };
                delete cvResponse.status;
                const response = await request(serverTest)
                    .post(`${route}/`)
                    .set('authorization', `Token ${loggedInCandidat.token}`)
                    .send({ cv });
                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(cvResponse);
            });
            it('Should return 200 and CV with cv status set as published, if logged in user is coach of cv\'s owner', async () => {
                const cv = await cvFactory(
                    {
                        UserId: loggedInCandidat.user.id,
                        status: CV_STATUS.Published.value,
                        urlImg: null,
                    },
                    {},
                    false
                );
                cv.status = undefined;
                const response = await request(serverTest)
                    .post(`${route}/`)
                    .set('authorization', `Token ${loggedInCoach.token}`)
                    .send({ cv });
                expect(response.status).toBe(200);
                expect(response.body.status).toMatch(CV_STATUS.Published.value);
            });
            it('Should return 200 and CV with cv status set as published, if logged in admin', async () => {
                const cv = await cvFactory(
                    {
                        UserId: loggedInCandidat.user.id,
                        urlImg: null,
                    },
                    {},
                    false
                );
                cv.status = undefined;
                const cvResponse = {
                    ...cv,
                    status: CV_STATUS.Published.value,
                }
                const response = await request(serverTest)
                    .post(`${route}/`)
                    .set('authorization', `Token ${loggedInAdmin.token}`)
                    .send({ cv });
                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(cvResponse);
            });
            it('Should return 200 and CV with cv status set as draft, if logged in admin', async () => {
                const cv = await cvFactory(
                    {
                        UserId: loggedInCandidat.user.id,
                        status: CV_STATUS.Draft.value,
                        urlImg: null,
                    },
                    {},
                    false
                );
                const response = await request(serverTest)
                    .post(`${route}/`)
                    .set('authorization', `Token ${loggedInAdmin.token}`)
                    .send({ cv });
                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(cv);
            });
            it('Should return 401 if not logged in user', async () => {
                const cv = await cvFactory({ UserId: loggedInCandidat.user.id }, {}, false);
                const response = await request(serverTest)
                    .post(`${route}/`)
                    .send({ cv });
                expect(response.status).toBe(401);
            });
        });
        describe('R - Read 1 CV', () => {
            it('Should return 200 if valid user id provided', async () => {
                const response = await request(serverTest)
                    .get(`${route}/?userId=${loggedInCandidat.user.id}`);
                console.log('READ//////////', response.body);
                expect(response.status).toBe(200);
            });
            it('Should return 401 if invalid user id provided', async () => {
                const response = await request(serverTest)
                    .get(`${route}/?userId=123-fakeuserid`);
                expect(response.status).toBe(401);
            });
        });
        describe.skip('R - Read List of CVs', () => {

        });
        describe.skip('U - Update 1 CV', () => {

        });
        describe('D - Delete 1 CV', () => {
            it('Should return 200, if logged in admin', async () => {
                const cv = await cvFactory({ UserId: loggedInCandidat.user.id });
                const response = await request(serverTest)
                    .delete(`${route}/${cv.id}`)
                    .set('authorization', `Token ${loggedInAdmin.token}`);
                expect(response.status).toBe(200);
            });
            it('Should return 401, if cv not found', async () => {
                const response = await request(serverTest)
                    .delete(`${route}/3394b06e-b4eb-4a69-aba9-278ac1d9e1aa`);
                expect(response.status).toBe(401);
            });
            it('Should return 401, if not logged in admin', async () => {
                const cv = await cvFactory({ UserId: loggedInCandidat.user.id });
                const response = await request(serverTest)
                    .delete(`${route}/${cv.id}`)
                expect(response.status).toBe(401);
            });
        });
    });
});