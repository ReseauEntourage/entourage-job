const request = require('supertest');

const {
  startTestServer,
  recreateTestDB,
  resetTestDB,
  stopTestServer,
  createEntities,
  createLoggedInUser,
  associateCoachAndCandidat,
  associateManyOpportunitiesUser,
} = require('./helpers');
const { USER_ROLES } = require('../constants');
const opportunityFactory = require('./factories/opportunityFactory');
const userFactory = require('./factories/userFactory');

describe('Opportunity', () => {
  let serverTest;
  const route = '/api/v1/opportunity';
  const nbOpportunity = 10;
  const nbPrivateOpportunity = 5;
  let totalOpp = nbOpportunity + nbPrivateOpportunity + 1;
  let opportunities;
  let opportunitiesId;
  let loggedInAdmin;
  let loggedInCoach;
  let loggedInCandidat;
  let otherCandidat;
  let privateOpportunities;
  let opportunitiesCandidat;
  let opportunityOtherCandidat;
  let otherOpportunity;
  beforeAll(async () => {
    serverTest = await startTestServer();
    await recreateTestDB();
    opportunities = await createEntities(
      opportunityFactory,
      nbOpportunity,
      {
        isValidated: true,
        isPublic: true,
      },
      true
    );
    opportunitiesId = opportunities.map((o) => {
      return o.id;
    });

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
    privateOpportunities = await createEntities(
      opportunityFactory,
      nbPrivateOpportunity,
      {
        isValidated: true,
        isPublic: false,
      },
      true
    );
    const privateOpportunitiesId = privateOpportunities.map((op) => {
      return op.id;
    });
    opportunitiesCandidat = await associateManyOpportunitiesUser(
      privateOpportunitiesId,
      candidat.id
    );
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
    otherOpportunity = await opportunityFactory({
      isValidated: true,
      isPublic: false,
    });
    /*
      opportunityOtherCandidat = await opportunityFactory({
          isValidated: true,
          isPublished: true,
          isPublic: true,
      });
      console.log('opportunityOtherCandidat :>> ', opportunityOtherCandidat);
      console.log('otherCandidat :>> ', otherCandidat);
      await associateOpportunityUser(opportunityOtherCandidat.id, otherCandidat.user.id)
    */
  });
  afterAll(async () => {
    await resetTestDB();
    await stopTestServer();
  });
  describe('CRUD Opportunity', () => {
    describe('C - Opportunity', () => {
      describe('Anybody can create opportunities - /', () => {
        it('Should return 200, if valid opportunity', async () => {
          const opportunity = await opportunityFactory(
            { isPublic: true, isValidated: true },
            false
          );
          const response = await request(serverTest)
            .post(`${route}/`)
            .send(opportunity);
          expect(response.status).toBe(200);
          // eslint-disable-next-line no-plusplus
          totalOpp++;
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
            userId: loggedInCandidat.user.id,
          };
          const response = await request(serverTest)
            .post(`${route}/join`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send(body);
          expect(response.status).toBe(200);
          expect(response.body.OpportunityId).toEqual(opportunityId);
          expect(response.body.UserId).toEqual(loggedInCandidat.user.id);
        });
        it('should return 200, if a coach had his associated candidat to an opportunity', async () => {
          const opportunityId = opportunitiesId[1];
          const body = {
            opportunityId,
            userId: loggedInCandidat.user.id,
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
            userId: loggedInCandidat.user.id,
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
            userId: loggedInCandidat.user.id,
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
            userId: otherCandidat.user.id,
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
            userId: otherCandidat.user.id,
          };
          const response = await request(serverTest)
            .post(`${route}/join`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send(body);
          expect(response.status).toBe(401);
        });
      });
    });
    describe('R - Read Many opportunities', () => {
      describe('Read all opportunities - /admin', () => {
        it('Should return 200 and a list of all opportunities, if logged in admin', async () => {
          const response = await request(serverTest)
            .get(`${route}/admin`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(totalOpp);
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
      describe("Read a user's private opportunities - /user/private/:id", () => {
        it('should return 200, if candidat read his opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/private/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
        it('should return 200, if a coach read his associated candidat opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/private/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
        it('should return 200, if a admin read his associated candidat opportunities', async () => {
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
        it('should return 401, if candidat reads an other candidat opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/private/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${otherCandidat.token}`);
          expect(response.status).toBe(401);
        });
        it("should return 401, if a coach read not associate candidat's opportunities", async () => {
          const response = await request(serverTest)
            .get(`${route}/user/private/${otherCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(401);
        });
      });
      describe("Read all user's opportunities - /user/all/:id", () => {
        it('should return 200, if candidat read his opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/all/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
        it('should return 200, if a coach read his associated candidat opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/all/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
        it('should return 200, if a admin read his associated candidat opportunities', async () => {
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
        it('should return 401, if candidat reads an other candidat opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/all/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${otherCandidat.token}`);
          expect(response.status).toBe(401);
        });
        it("should return 401, if a coach read not associate candidat's opportunities", async () => {
          const response = await request(serverTest)
            .get(`${route}/user/all/${otherCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(401);
        });
      });
      describe('Read one specific opportunity - /:opportunityId', () => {
        it('should return 200, if candidat read one of his opportunity', async () => {
          const response = await request(serverTest)
            .get(`${route}/${privateOpportunities[0].id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.id).toStrictEqual(privateOpportunities[0].id);
        });
        it('should return 200, if a coach reads his associated candidat opportunity', async () => {
          const response = await request(serverTest)
            .get(`${route}/${privateOpportunities[0].id}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(200);
          expect(response.body.id).toStrictEqual(privateOpportunities[0].id);
        });
        it('should return 204, if candidat read an opportunity not associated to him', async () => {
          const response = await request(serverTest)
            .get(`${route}/${otherOpportunity.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(204);
          expect(response.body).toStrictEqual({});
        });
        it('should return 200, if admin reads an opportunity', async () => {
          const response = await request(serverTest)
            .get(`${route}/${opportunities[0].id}`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.id).toStrictEqual(opportunities[0].id);
        });
        it('should return 401, if user not connected', async () => {
          const response = await request(serverTest).get(
            `${route}/${opportunitiesId[0]}`
          );
          expect(response.status).toBe(401);
        });
      });
    });
    describe('U - Update 1', () => {
      describe('Update an oppotunity - /', () => {
        it('Should return 200, if admin updates an opportunity', async () => {
          const update = {
            ...opportunities[0],
            isValidated: true,
            isPublished: true,
            title: 'updated title',
          };
          const response = await request(serverTest)
            .put(`${route}/`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send(update);
          expect(response.status).toBe(200);
          expect(response.body.title).toBe('updated title');
        });
        it('Should return 401, if no an admin', async () => {
          const update = {
            ...opportunities[1],
            isValidated: true,
            isPublished: true,
            title: 'updated title',
          };
          const response = await request(serverTest)
            .put(`${route}/`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send(update);
          expect(response.status).toBe(401);
        });
      });
      describe('Update a user opportunity association - /join', () => {
        it('should return 200, if candidat updates his opportunities asociations', async () => {
          const update = {
            ...opportunitiesCandidat[0],
            note: 'noteUpdate',
          };
          const response = await request(serverTest)
            .put(`${route}/join`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send(update);
          expect(response.status).toBe(200);
          expect(response.body.note).toBe('noteUpdate');
        });
        it('should return 200, if a coach updates his associated candidat opportunities asociations', async () => {
          const update = {
            ...opportunitiesCandidat[1],
            seen: true,
          };
          const response = await request(serverTest)
            .put(`${route}/join`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send(update);
          expect(response.status).toBe(200);
          expect(response.body.seen).toBe(true);
        });
        it('should return 200, if a admin updates candidat opportunities asociations', async () => {
          const update = {
            ...opportunitiesCandidat[2],
            bookmarked: true,
          };
          const response = await request(serverTest)
            .put(`${route}/join`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send(update);
          expect(response.status).toBe(200);
          expect(response.body.bookmarked).toBe(true);
        });
        it('should return 401, if invalid user id', async () => {
          const update = {
            ...opportunitiesCandidat[3],
            userId: '1111-invalid-99999',
          };
          const response = await request(serverTest)
            .put(`${route}/join`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send(update);
          expect(response.status).toBe(200);
        });
        it('should return 401, if candidat updates an other candidat opportunities asociations', async () => {
          const update = {
            ...opportunitiesCandidat[4],
            status: 1000,
          };
          const response = await request(serverTest)
            .put(`${route}/join`)
            .set('authorization', `Token ${otherCandidat.token}`)
            .send(update);
          expect(response.status).toBe(401);
        });
        it("should return 401, if a coach updates not associate candidat's opportunities asociations", async () => {
          const update = {
            ...opportunityOtherCandidat,
            bookmarked: true,
          };
          const response = await request(serverTest)
            .put(`${route}/join`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send(update);
          expect(response.status).toBe(401);
        });
      });
    });
    describe('D - Delete 1', () => {
      it('Should return 200, if admin', async () => {
        const response = await request(serverTest)
          .delete(`${route}/${opportunitiesId[9]}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
      });
      it('Should return 401, if not admin', async () => {
        const response = await request(serverTest)
          .delete(`${route}/${opportunitiesId[8]}`)
          .set('authorization', `Token ${loggedInCoach.token}`);
        expect(response.status).toBe(401);
      });
      it("Should return 401, if not opportnity doesn't exist", async () => {
        const response = await request(serverTest)
          .delete(`${route}/a824df-c9e0-42cb-adb6-02267fc9e5f6`)
          .set('authorization', `Token ${loggedInCoach.token}`);
        expect(response.status).toBe(401);
      });
    });
  });
});
