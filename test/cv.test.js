const request = require('supertest');

const {
    startTestServer,
    recreateTestDB,
    stopTestServer,
    resetTestDB,
} = require('./helpers/helpers');
const createLoggedInUser = require('./helpers/user.helpers');
const USER_ROLES = require('../constants');
const cvFactory = require('./factories/cvFactory');
const { CV_STATUS } = require('../constants');

const route = '/api/v1/cv';
let serverTest;
let loggedInAdmin;
let loggedInCandidat;
let loggedInCoach;

beforeAll(async () => {
    await recreateTestDB();
    serverTest = await startTestServer();
    loggedInAdmin = await createLoggedInUser({
        role: USER_ROLES.ADMIN,
        password: 'admin',
    });
    loggedInCoach = await createLoggedInUser({
        role: USER_ROLES.COACH,
        password: 'coach',
    })
    loggedInCandidat = await createLoggedInUser({
        role: USER_ROLES.CANDIDAT,
        password: 'candidat',
    });

});

afterAll(async () => {
    await resetTestDB();
    await stopTestServer();
});

describe('CV', () => {
    describe('CRUD CV', () => {
        describe('C - Create 1 CV', () => {
            it('Should return 200 and CV if loggged in user', async () => {
                const cv = await cvFactory({ UserId: loggedInCandidat.user.id }, {}, false);
                const cvResponse = { ...cv };
                delete cvResponse.status;
                const response = await request(serverTest)
                    .post(`${route}/`)
                    .set('authorization', `Token ${loggedInCandidat.token}`)
                    .send({ cv });
                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(cvResponse);
            });
            it('Should return 200 and CV with cv status set as published, if logged in coach', async () => {
                const cv = await cvFactory({ UserId: loggedInCoach.user.id }, {}, false);
                delete cv.status;
                const response = await request(serverTest)
                    .post(`${route}/`)
                    .set('authorization', `Token ${loggedInCoach.token}`)
                    .send({ cv });
                expect(response.status).toBe(200);
                expect(response.body.status).toMatch(CV_STATUS.Published.value);

            });
            it('Should return 200 and CV with cv status set as published, if logged in admin', async () => {
                const cv = await cvFactory({ UserId: loggedInCandidat.user.id, }, {}, false);
                delete cv.status;
                const response = await request(serverTest)
                    .post(`${route}/`)
                    .set('authorization', `Token ${loggedInCandidat.token}`)
                    .send({ cv });
                expect(response.status).toBe(200);
                expect(response.body.status).toMatchObject(CV_STATUS.Published.value);

            });
            it('Should return 200 and CV with cv status set as draft, if logged in admin', async () => {
                const cv = await cvFactory(
                    {
                        UserId: loggedInCandidat.user.id,
                        status: CV_STATUS.Draft.value
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

        });
        describe('R - Read List of CVs', () => {

        });
        describe('U - Update 1 CV', () => {

        });
        describe('D - Delete 1 CV', () => {
            it('Should return 200 an ??? , if logged in admin', async () => {
                const cv = await cvFactory({ UserId: loggedInCandidat.user.id });
                console.log('::::::::::: CREATE CV IN DB :::::::::', cv);
                const response = await request(serverTest)
                    .delete(`${route}/${cv.id}`)
                    .set('authorization', `Token ${loggedInAdmin.token}`);
                console.log(':::::::::::::::::::: DELETE ::::::::::::::::::::::::::', response.body);
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