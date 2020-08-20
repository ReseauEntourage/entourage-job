const request = require('supertest');

const {
    startTestServer,
    recreateTestDB,
    resetTestDB,
    stopTestServer,
    createEntities,
    createLoggedInUser,
    associateCoachAndCandidat,
} = require("./helpers");
const { USER_ROLES } = require('../constants');
const opportunityFactory = require("./factories/opportunityFactory");
const userFactory = require('./factories/userFactory');

describe('Opportunity', () => {
    let serverTest;
    const route = '/api/v1/opportunity';
    let opportunitiesID;
    let loggedInAdmin;
    let loggedInCoach;
    let loggedInCandidat;

    beforeAll(async () => {
        serverTest = await startTestServer();
        await recreateTestDB();
        const opportunities = await createEntities(opportunityFactory, 10, {}, true);
        opportunitiesID = opportunities.map(o => o.id);

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
    describe('CRUD Opportunity', () => {
        describe('C - Opportunity', () => {
            describe('Anybody can create opportunities - /', () => {
                it('Should return 200, if valid opportunity', async () => {
                    const opportunity = await opportunityFactory({}, false);
                    const response = await request(serverTest)
                        .post(`${route}/`)
                        .send(opportunity);
                    expect(response.status).toBe(200);
                });
                it('Should return 401, if invalid opportunity', async () => {
                    const opportunity = await opportunityFactory({}, false);
                    delete opportunity.recruiterMail;
                    const response = await request(serverTest)
                        .post(`${route}/`)
                        .send(opportunity);
                    expect(response.status).toBe(401);
                });
            });
            describe.skip('Add a user to an opportunity - /join', () => {
                it('should return 200, if candidat had himself to an opportunity', async () => {

                });
                it(
                    'should return 200, if a coach had his associated candidat to an opportunity',
                    async () => {

                    });
                it('should return 200, if admin had candidat to an opportunity', async () => {

                });
                it('should return 401, if invalid opportunity id', async () => {

                });
                it('should return 401, if candidat updates an other candidat', async () => {

                });
                it('should return 401, if a coach updates not associate candidat', async () => {

                });
            });
        });
        describe.skip('R - Read 1 opportunity', () => {

        });
        describe.skip('R - Read Many opportunities', () => {
            describe('Read all opportunities - /admin', () => {
                it('Should return 200 and a list of opportunities, if logged in admin', () => {

                });
                it('Should return 401, if not logged in admin', () => {

                });
            });
            describe('Read a user\'s private opportunities - /user/private/:id', () => {
                it('should return 200, if candidat read his opportunities', async () => {

                });
                it(
                    'should return 200, if a coach read his associated candidat opportunities',
                    async () => {

                    });
                it(
                    'should return 200, if a admin read his associated candidat opportunities',
                    async () => {

                    });
                it('should return 401, if invalid user id', async () => {

                });
                it(
                    'should return 401, if candidat reads an other candidat opportunities',
                    async () => {

                    });
                it(
                    'should return 401, if a coach read not associate candidat\'s opportunities',
                    async () => {

                    });
            });
            // TODO : check if this route also gets private opportunities
            describe.skip('Read all user\'s opportunities - /user/all/:id', () => {
                it('should return 200, if candidat read his opportunities', async () => {

                });
                it(
                    'should return 200, if a coach read his associated candidat opportunities',
                    async () => {

                    });
                it(
                    'should return 200, if a admin read his associated candidat opportunities',
                    async () => {

                    });
                it('should return 401, if invalid user id', async () => {

                });
                it(
                    'should return 401, if candidat reads an other candidat opportunities',
                    async () => {

                    });
                it(
                    'should return 401, if a coach read not associate candidat\'s opportunities',
                    async () => {

                    });
            });
        });
        describe.skip('U - Update 1', () => {
            describe('Update an oppotunity - /', () => {
                it('Should return 200, if admin updates an opportunity', async () => {

                });
                it('Should return 401, if no an admin', async () => {

                });
            });
            describe('Update a user opportunity association - /join', () => {
                it(
                    'should return 200, if candidat updates his opportunities asociations',
                    async () => {

                    });
                it(
                    'should return 200, if a coach updates his associated candidat opportunities asociations', async () => {

                    });
                it(
                    'should return 200, if a admin updates candidat opportunities asociations',
                    async () => {

                    });
                it('should return 401, if invalid user id', async () => {

                });
                it(
                    'should return 401, if candidat updates an other candidat opportunities asociations',
                    async () => {

                    });
                it(
                    'should return 401, if a coach updates not associate candidat\'s opportunities asociations',
                    async () => {

                    });
            });
        });
        describe.skip('D - Delete 1', () => {
            it('Should return 200, if admin', async () => {

            });
            it('Should return 401, if not admin', async () => {

            });

        })
    });
});