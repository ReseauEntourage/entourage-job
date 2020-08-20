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
    let nbOpportunity = 10;
    let opportunitiesId;
    let loggedInAdmin;
    let loggedInCoach;
    let loggedInCandidat;
    let otherCandidat

    beforeAll(async () => {
        serverTest = await startTestServer();
        await recreateTestDB();
        const opportunities = await createEntities(
            opportunityFactory,
            nbOpportunity,
            {},
            true
        );
        opportunitiesId = opportunities.map(o => o.id);

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
        otherCandidat = await createLoggedInUser({
            role: USER_ROLES.CANDIDAT,
            password: 'user',
        });
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
                    // eslint-disable-next-line no-plusplus
                    nbOpportunity++;
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
            describe('Add a user to an opportunity - /join', () => {
                it('should return 200, if candidat had himself to an opportunity', async () => {
                    const opportunityId = opportunitiesId[0];
                    const body = {
                        opportunityId,
                        userId: loggedInCandidat.user.id
                    };
                    const response = await request(serverTest)
                        .post(`${route}/join`)
                        .set('authorization', `Token ${loggedInCandidat.token}`)
                        .send(body);
                    expect(response.status).toBe(200);
                    expect(response.body.OpportunityId).toEqual(opportunityId);
                    expect(response.body.UserId).toEqual(loggedInCandidat.user.id);
                });
                it(
                    'should return 200, if a coach had his associated candidat to an opportunity',
                    async () => {
                        const opportunityId = opportunitiesId[1];
                        const body = {
                            opportunityId,
                            userId: loggedInCandidat.user.id
                        };
                        const response = await request(serverTest)
                            .post(`${route}/join`)
                            .set('authorization', `Token ${loggedInCoach.token}`)
                            .send(body);
                        expect(response.status).toBe(200);
                        expect(response.body.OpportunityId).toEqual(opportunityId);
                        expect(response.body.UserId).toEqual(loggedInCandidat.user.id);
                    });
                it('should return 200, if admin had candidat to an opportunity', async () => {
                    const opportunityId = opportunitiesId[2];
                    const body = {
                        opportunityId,
                        userId: loggedInCandidat.user.id
                    };
                    const response = await request(serverTest)
                        .post(`${route}/join`)
                        .set('authorization', `Token ${loggedInCoach.token}`)
                        .send(body);
                    expect(response.status).toBe(200);
                    expect(response.body.OpportunityId).toEqual(opportunityId);
                    expect(response.body.UserId).toEqual(loggedInCandidat.user.id);
                });
                it('should return 401, if invalid opportunity id', async () => {
                    const opportunityId = 'Òa824df-c9e0-42cb-adb6-02267fc9e5f6';
                    const body = {
                        opportunityId,
                        userId: loggedInCandidat.user.id
                    };
                    const response = await request(serverTest)
                        .post(`${route}/join`)
                        .set('authorization', `Token ${loggedInCoach.token}`)
                        .send(body);
                    expect(response.status).toBe(401);
                });
                it('should return 401, if candidat updates an other candidat', async () => {
                    const opportunityId = opportunitiesId[3];
                    const body = {
                        opportunityId,
                        userId: otherCandidat.user.id
                    };
                    const response = await request(serverTest)
                        .post(`${route}/join`)
                        .set('authorization', `Token ${loggedInCandidat.token}`)
                        .send(body);
                    expect(response.status).toBe(401);
                });
                it('should return 401, if a coach updates not associate candidat', async () => {
                    const opportunityId = opportunitiesId[4];
                    const body = {
                        opportunityId,
                        userId: otherCandidat.user.id
                    };
                    const response = await request(serverTest)
                        .post(`${route}/join`)
                        .set('authorization', `Token ${loggedInCoach.token}`)
                        .send(body);
                    expect(response.status).toBe(401);
                });
            });
        });
        describe.skip('R - Read 1 opportunity', () => {

        });
        describe('R - Read Many opportunities', () => {
            // TODO: add a query search
            describe('Read all opportunities - /admin', () => {
                it('Should return 200 and a list of all opportunities, if logged in admin', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/admin`)
                        .set('authorization', `Token ${loggedInAdmin.token}`);
                    expect(response.status).toBe(200);
                    expect(response.body.length).toBe(nbOpportunity);
                });
                it('Should return 200 and a list of searched opportunities, if logged in admin', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/admin?query='e'`)
                        .set('authorization', `Token ${loggedInAdmin.token}`);
                    expect(response.status).toBe(200);
                });
                it('Should return 401, if not logged in admin', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/admin`)
                        .set('authorization', `Token ${loggedInCandidat.token}`);
                    expect(response.status).toBe(401);
                });
            });
            describe('Read a user\'s private opportunities - /user/private/:id', () => {
                it('should return 200, if candidat read his opportunities', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/user/private/${loggedInCandidat.user.id}`)
                        .set('authorization', `Token ${loggedInCandidat.token}`);
                    expect(response.status).toBe(200);
                    expect(response.body.length).toBeGreaterThanOrEqual(1);
                });
                it(
                    'should return 200, if a coach read his associated candidat opportunities',
                    async () => {
                        const response = await request(serverTest)
                            .get(`${route}/user/private/${loggedInCandidat.user.id}`)
                            .set('authorization', `Token ${loggedInCoach.token}`);
                        expect(response.status).toBe(200);
                        expect(response.body.length).toBeGreaterThanOrEqual(1);
                    });
                it(
                    'should return 200, if a admin read his associated candidat opportunities',
                    async () => {
                        const response = await request(serverTest)
                            .get(`${route}/user/private/${loggedInCandidat.user.id}`)
                            .set('authorization', `Token ${loggedInAdmin.token}`);
                        expect(response.status).toBe(200);
                        expect(response.body.length).toBeGreaterThanOrEqual(1);
                    });
                it('should return 401, if invalid user id', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/user/private/a824df-c9e0-42cb-adb6-02267fc9e5f6`)
                        .set('authorization', `Token ${loggedInAdmin.token}`);
                    expect(response.status).toBe(401);
                });
                it(
                    'should return 401, if candidat reads an other candidat opportunities',
                    async () => {
                        const response = await request(serverTest)
                            .get(`${route}/user/private/${loggedInCandidat.user.id}`)
                            .set('authorization', `Token ${otherCandidat.token}`);
                        expect(response.status).toBe(401);
                    });
                it(
                    'should return 401, if a coach read not associate candidat\'s opportunities',
                    async () => {
                        const response = await request(serverTest)
                            .get(`${route}/user/private/${otherCandidat.user.id}`)
                            .set('authorization', `Token ${loggedInCoach.token}`);
                        expect(response.status).toBe(401);
                    });
            });
            describe('Read all user\'s opportunities - /user/all/:id', () => {
                it('should return 200, if candidat read his opportunities', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/user/all/${loggedInCandidat.user.id}`)
                        .set('authorization', `Token ${loggedInCandidat.token}`);
                    expect(response.status).toBe(200);
                    expect(response.body.length).toBeGreaterThanOrEqual(1);
                });
                it(
                    'should return 200, if a coach read his associated candidat opportunities',
                    async () => {
                        const response = await request(serverTest)
                            .get(`${route}/user/all/${loggedInCandidat.user.id}`)
                            .set('authorization', `Token ${loggedInCoach.token}`);
                        expect(response.status).toBe(200);
                        expect(response.body.length).toBeGreaterThanOrEqual(1);
                    });
                it(
                    'should return 200, if a admin read his associated candidat opportunities',
                    async () => {
                        const response = await request(serverTest)
                            .get(`${route}/user/all/${loggedInCandidat.user.id}`)
                            .set('authorization', `Token ${loggedInAdmin.token}`);
                        expect(response.status).toBe(200);
                        expect(response.body.length).toBeGreaterThanOrEqual(1);
                    });
                it('should return 401, if invalid user id', async () => {
                    const response = await request(serverTest)
                        .get(`${route}/user/all/a824df-c9e0-42cb-adb6-02267fc9e5f6`)
                        .set('authorization', `Token ${loggedInAdmin.token}`);
                    expect(response.status).toBe(401);
                });
                it(
                    'should return 401, if candidat reads an other candidat opportunities',
                    async () => {
                        const response = await request(serverTest)
                            .get(`${route}/user/all/${loggedInCandidat.user.id}`)
                            .set('authorization', `Token ${otherCandidat.token}`);
                        expect(response.status).toBe(401);
                    });
                it(
                    'should return 401, if a coach read not associate candidat\'s opportunities',
                    async () => {
                        const response = await request(serverTest)
                            .get(`${route}/user/all/${otherCandidat.user.id}`)
                            .set('authorization', `Token ${loggedInCoach.token}`);
                        expect(response.status).toBe(401);
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