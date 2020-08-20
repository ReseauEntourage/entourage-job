const request = require('supertest');

const {
    startTestServer,
    recreateTestDB,
    stopTestServer,
    resetTestDB,
    associateCoachAndCandidat,
    createLoggedInUser,
    getCandidatUrl,
} = require('./helpers');
const cvFactory = require('./factories/cvFactory');
const { USER_ROLES } = require('../constants');
const { CV_STATUS } = require('../constants');
const userFactory = require('./factories/userFactory');

describe.skip('CV', () => {
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
            describe('/?userId= Get a CV by user id', () => {
                it('Should return 200 if valid user id provided', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/?userId=${loggedInCandidat.user.id}`);
                    expect(response.body.UserId).toBe(loggedInCandidat.user.id);
                    expect(response.status).toBe(200);
                });
                it('Should return 401 if invalid user id provided', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/?userId=123-fakeuserid`);
                    expect(response.status).toBe(401);
                });
            });
            describe('/ - Get a CV by candidat\'s url', () => {
                it('Should return 200 if valid candidat\'s url provided', async () => {
                    const candidatUrl = await getCandidatUrl(loggedInCandidat.user.id);
                    const response = await request(serverTest)
                        .get(`${route}/${candidatUrl}`);
                    expect(response.status).toBe(200);
                });
                it('Should return 204 if valid url provided and candidat doesn\'t have a CV', async () => {
                    const candidatNoCv = await createLoggedInUser({
                        role: USER_ROLES.CANDIDAT,
                        password: 'candidatNoCv',
                    });
                    const candidatNoCvUrl = getCandidatUrl(candidatNoCv.user.id);
                    const response = await request(serverTest)
                        .get(`${route}/${candidatNoCvUrl}`);
                    expect(response.status).toBe(204);
                });
                it('Should return 401 if candidat\'s url is invalid', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/fakeuser-1234553`);
                    expect(response.status).toBe(401);
                });
            });
        });
        describe.skip('R - Read List of CVs', () => {
            it('Should return 200, and 1 cv', async () => {
                const response = await request(serverTest)
                    .get(`${route}/cards/random/?nb=1`);
                expect(response.status).toBe(200);
            });
            it('Should return 200, and 1 cv if user\'s first name contain an e', async () => {
                const response = await request(serverTest)
                    .get(`${route}/cards/random/?nb=1&q=e`);
                expect(response.status).toBe(200);
            });
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