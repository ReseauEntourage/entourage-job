import { OFFER_STATUS, USER_ROLES } from 'src/constants';
import opportunityFactory, {
  getTotalOppsInDB,
  incrTotalOppsInDB,
} from 'tests/factories/opportunityFactory';
import userFactory from 'tests/factories/userFactory';

import request from 'supertest';

import {
  associateCoachAndCandidat,
  associateManyOpportunitiesUser,
  associateOpportunityUser,
  createEntities,
  createLoggedInUser,
  recreateTestDB,
  resetTestDB,
  startTestServer,
  stopTestServer,
} from 'tests/helpers';
import { models } from 'src/db/models';

describe('Opportunity', () => {
  let serverTest;
  const route = '/api/v1/opportunity';
  const nbOpportunity = 10;
  const nbPrivateOpportunity = 6;
  const nbPublicOpportunitiesToAssociate = 5;

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
  let candidatExternalOpportunity;
  let otherCandidatExternalOpportunity;

  beforeAll(async () => {
    serverTest = await startTestServer();
    await recreateTestDB();
    opportunities = [
      ...(await createEntities(
        opportunityFactory,
        nbOpportunity / 2,
        {
          isValidated: true,
          isPublic: true,
          department: 'Rhône (69)',
        },
        { businessLines: ['id', 'aa'] },
        true
      )),
      ...(await createEntities(
        opportunityFactory,
        nbOpportunity / 2,
        {
          isValidated: true,
          isPublic: true,
          department: 'Paris (75)',
        },
        { businessLines: ['id', 'aa'] },
        true
      )),
    ];

    await createEntities(
      opportunityFactory,
      2,
      {
        isValidated: false,
        isPublic: false,
        department: 'Paris (75)',
      },
      { businessLines: ['id', 'aa'] },
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
    privateOpportunities = [
      ...(await createEntities(
        opportunityFactory,
        nbPrivateOpportunity / 2,
        {
          isValidated: true,
          isPublic: false,
          department: 'Rhône (69)',
        },
        { businessLines: ['id', 'aa'] },
        true
      )),
      ...(await createEntities(
        opportunityFactory,
        nbPrivateOpportunity / 2,
        {
          isValidated: true,
          isPublic: false,
          department: 'Paris (75)',
        },
        { businessLines: ['id', 'aa'] },
        true
      )),
    ];
    const privateOpportunitiesId = privateOpportunities.map((op) => {
      return op.id;
    });
    opportunitiesCandidat = await associateManyOpportunitiesUser(
      privateOpportunitiesId,
      candidat.id
    );

    const publicOpportunitiesToAssociate = await createEntities(
      opportunityFactory,
      nbPublicOpportunitiesToAssociate,
      {
        isValidated: true,
        isPublic: true,
        department: 'Rhône (69)',
      },
      { businessLines: ['id', 'aa'] },
      true
    );

    await associateManyOpportunitiesUser(
      publicOpportunitiesToAssociate.map((opp) => {
        return opp.id;
      }),
      candidat.id
    );

    admin.password = 'admin';
    coach.password = 'coach';
    candidat.password = 'candidat';
    await associateCoachAndCandidat(coach, candidat);
    loggedInAdmin = await createLoggedInUser(admin, {}, false);
    loggedInCoach = await createLoggedInUser(coach, {}, false);
    loggedInCandidat = await createLoggedInUser(candidat, {}, false);
    otherCandidat = await createLoggedInUser({
      role: USER_ROLES.CANDIDAT,
      password: 'user',
    });
    otherOpportunity = await opportunityFactory({
      isValidated: true,
      isPublic: false,
    });

    opportunityOtherCandidat = await opportunityFactory({
      isValidated: true,
      isPublished: true,
      isPublic: true,
    });

    await associateOpportunityUser(
      opportunityOtherCandidat.id,
      otherCandidat.user.id
    );

    await opportunityFactory({
      isValidated: false,
      isPublic: true,
      isArchived: false,
    });
    await opportunityFactory({
      isValidated: false,
      isPublic: false,
      isArchived: false,
    });

    await opportunityFactory({
      isValidated: false,
      isPublic: true,
      isArchived: true,
    });

    await opportunityFactory({
      isValidated: false,
      isPublic: false,
      isArchived: true,
    });

    const opportunity1ForFilters = await opportunityFactory(
      {
        isValidated: true,
        isPublic: false,
        department: 'Rhône (69)',
      },
      { businessLines: ['aa'] }
    );

    await associateOpportunityUser(
      opportunity1ForFilters.id,
      loggedInCandidat.user.id,
      {
        status: OFFER_STATUS[2].value,
        archived: false,
        recommended: false,
      }
    );

    const opportunity2ForFilters = await opportunityFactory(
      {
        isValidated: true,
        isPublic: true,
        department: 'Rhône (69)',
      },
      { businessLines: ['id'] }
    );

    await associateOpportunityUser(
      opportunity2ForFilters.id,
      loggedInCandidat.user.id,
      {
        status: OFFER_STATUS[1].value,
        archived: false,
        recommended: false,
      }
    );
    const opportunity3ForFilters = await opportunityFactory(
      {
        isValidated: true,
        isPublic: true,
        department: 'Rhône (69)',
      },
      { businessLines: ['aa'] }
    );

    await associateOpportunityUser(
      opportunity3ForFilters.id,
      loggedInCandidat.user.id,
      {
        status: OFFER_STATUS[2].value,
        archived: false,
        recommended: false,
      }
    );

    const opportunity4ForFilters = await opportunityFactory(
      {
        isValidated: true,
        isPublic: true,
        department: 'Rhône (69)',
      },
      { businessLines: ['id'] }
    );

    await associateOpportunityUser(
      opportunity4ForFilters.id,
      loggedInCandidat.user.id,
      {
        status: OFFER_STATUS[2].value,
        archived: true,
        recommended: false,
      }
    );

    const opportunity5ForFilters = await opportunityFactory(
      {
        isValidated: false,
        isPublic: false,
        department: 'Rhône (69)',
      },
      { businessLines: ['aa'] }
    );

    await associateOpportunityUser(
      opportunity5ForFilters.id,
      loggedInCandidat.user.id,
      {
        status: OFFER_STATUS[2].value,
        archived: false,
        recommended: true,
      }
    );

    const opportunity6ForFilters = await opportunityFactory(
      {
        isValidated: true,
        isPublic: true,
        department: 'Rhône (69)',
      },
      { businessLines: ['id'] }
    );

    await associateOpportunityUser(
      opportunity6ForFilters.id,
      loggedInCandidat.user.id,
      {
        status: OFFER_STATUS[2].value,
        archived: false,
        recommended: false,
      }
    );

    const opportunity7ForFilters = await opportunityFactory(
      {
        isValidated: true,
        isPublic: true,
        department: 'Rhône (69)',
      },
      { businessLines: ['aa'] }
    );

    await associateOpportunityUser(
      opportunity7ForFilters.id,
      loggedInCandidat.user.id,
      {
        status: OFFER_STATUS[2].value,
        archived: false,
        recommended: false,
      }
    );

    const opportunity8ForFilters = await opportunityFactory(
      {
        isValidated: true,
        isPublic: true,
        department: 'Rhône (69)',
      },
      { businessLines: ['aa'] }
    );

    await associateOpportunityUser(
      opportunity8ForFilters.id,
      loggedInCandidat.user.id,
      {
        status: OFFER_STATUS[2].value,
        archived: false,
        recommended: false,
      }
    );

    candidatExternalOpportunity = await opportunityFactory({
      isValidated: true,
      isPublic: false,
      isArchived: false,
      isExternal: true,
    });

    otherCandidatExternalOpportunity = await opportunityFactory({
      isValidated: true,
      isPublic: false,
      isArchived: false,
      isExternal: true,
    });

    await associateOpportunityUser(
      candidatExternalOpportunity.id,
      loggedInCandidat.user.id
    );

    await associateOpportunityUser(
      otherCandidatExternalOpportunity.id,
      otherCandidat.user.id
    );
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
            { isPublic: true, isValidated: false },
            {},
            false
          );
          const response = await request(serverTest)
            .post(`${route}/`)
            .send(opportunity);
          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              ...opportunity,
              createdAt: response.body.createdAt,
              updatedAt: response.body.updatedAt,
            })
          );
          incrTotalOppsInDB();
        });
        it('Should return 200, and createById if valid opportunity created by logged in admin or candidate', async () => {
          const opportunity = await opportunityFactory(
            { isPublic: true, isValidated: false },
            {},
            false
          );
          const response = await request(serverTest)
            .post(`${route}/`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send(opportunity);
          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              ...opportunity,
              createdAt: response.body.createdAt,
              updatedAt: response.body.updatedAt,
              createdBy: loggedInAdmin.user.id,
            })
          );
          incrTotalOppsInDB();
        });
        it('Should return 200, if valid opportunity', async () => {
          const opportunity = await opportunityFactory(
            { isPublic: true, isValidated: false },
            {},
            false
          );
          const response = await request(serverTest)
            .post(`${route}/`)
            .send(opportunity);
          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              ...opportunity,
              createdAt: response.body.createdAt,
              updatedAt: response.body.updatedAt,
            })
          );
          incrTotalOppsInDB();
        });
        it('Should return 200, if valid opportunity and multiple locations', async () => {
          const { address, department, ...opportunity } =
            await opportunityFactory(
              { isPublic: true, isValidated: false },
              {},
              false
            );

          const locations = {
            paris: { address: 'Rue de Paris', department: 'Paris dept' },
            lyon: { address: 'Rue de Lyon', department: 'Lyon dept' },
            lille: { address: 'Rue de Lille', department: 'Lille dept' },
          };
          const response = await request(serverTest)
            .post(`${route}/`)
            .send({
              ...opportunity,
              locations: [locations.paris, locations.lyon, locations.lille],
            });
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(3);
          expect(response.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                ...opportunity,
                address: locations.paris.address,
                department: locations.paris.department,
                createdAt: response.body[0].createdAt,
                updatedAt: response.body[0].updatedAt,
              }),
              expect.objectContaining({
                ...opportunity,
                address: locations.lyon.address,
                department: locations.lyon.department,
                createdAt: response.body[1].createdAt,
                updatedAt: response.body[1].updatedAt,
              }),
              expect.objectContaining({
                ...opportunity,
                address: locations.lille.address,
                department: locations.lille.department,
                createdAt: response.body[2].createdAt,
                updatedAt: response.body[2].updatedAt,
              }),
            ])
          );
          incrTotalOppsInDB();
          incrTotalOppsInDB();
          incrTotalOppsInDB();
        });
        it('Should return 401, if invalid opportunity', async () => {
          const opportunity = await opportunityFactory({}, {}, false);
          delete opportunity.title;
          const response = await request(serverTest)
            .post(`${route}/`)
            .send(opportunity);
          expect(response.status).toBe(401);
        });
      });
      describe('Logged in users can create external opportunities - /external', () => {
        it('Should return 200, and status be "Contacted", if logged in as candidate and valid opportunity with authorized values', async () => {
          const opportunity = await opportunityFactory({}, {}, false);

          const candidateId = loggedInCandidat.user.id;
          const newOpportunity = {
            title: opportunity.title,
            company: opportunity.company,
            contract: opportunity.contract,
            startOfContract: opportunity.startOfContract,
            endOfContract: opportunity.endOfContract,
            isPartTime: opportunity.isPartTime,
            department: opportunity.department,
          };
          const response = await request(serverTest)
            .post(`${route}/external`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({ candidateId, ...newOpportunity });
          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              ...newOpportunity,
              isExternal: true,
              isPublic: false,
              isValidated: true,
              createdAt: response.body.createdAt,
              updatedAt: response.body.updatedAt,
              createdBy: loggedInCandidat.user.id,
            })
          );
          expect(response.body.userOpportunity.UserId).toMatch(candidateId);
          // status 0 = "Contacté"
          expect(response.body.userOpportunity.status).toBe(0);
          incrTotalOppsInDB();
        });
        it('Should return 401, if logged in as candidate and valid opportunity with unauthorized values', async () => {
          const opportunity = await opportunityFactory({}, {}, false);
          const candidateId = loggedInCandidat.user.id;
          const newOpportunity = {
            title: opportunity.title,
            company: opportunity.company,
            contract: opportunity.contract,
            startOfContract: opportunity.startOfContract,
            endOfContract: opportunity.endOfContract,
            isPartTime: opportunity.isPartTime,
            department: opportunity.department,
            isPublic: opportunity.isPublic,
          };
          const response = await request(serverTest)
            .post(`${route}/external`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({ candidateId, ...newOpportunity });
          expect(response.status).toBe(401);
        });
        it('Should return 401, if logged in as candidate and invalid opportunity', async () => {
          const opportunity = await opportunityFactory({}, {}, false);
          const candidateId = loggedInCandidat.user.id;
          const newOpportunity = {
            title: opportunity.title,
            company: opportunity.company,
            contract: opportunity.contract,
            startOfContract: opportunity.startOfContract,
            endOfContract: opportunity.endOfContract,
            isPartTime: opportunity.isPartTime,
            department: opportunity.department,
            isPublic: opportunity.isPublic,
          };
          delete newOpportunity.title;

          const response = await request(serverTest)
            .post(`${route}/external`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({ candidateId, ...newOpportunity });

          expect(response.status).toBe(401);
        });

        it('Should return 200, and status be "Contacted", if logged in as coach and valid opportunity with authorized values', async () => {
          const opportunity = await opportunityFactory({}, {}, false);

          const candidateId = loggedInCandidat.user.id;
          const newOpportunity = {
            title: opportunity.title,
            company: opportunity.company,
            contract: opportunity.contract,
            startOfContract: opportunity.startOfContract,
            endOfContract: opportunity.endOfContract,
            isPartTime: opportunity.isPartTime,
            department: opportunity.department,
          };
          const response = await request(serverTest)
            .post(`${route}/external`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({ candidateId, ...newOpportunity });
          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              ...newOpportunity,
              isExternal: true,
              isPublic: false,
              isValidated: true,
              createdAt: response.body.createdAt,
              updatedAt: response.body.updatedAt,
            })
          );
          expect(response.body.userOpportunity.UserId).toMatch(candidateId);
          // status 0 = "Contacté"
          expect(response.body.userOpportunity.status).toBe(0);
          incrTotalOppsInDB();
        });
        it("Should return 401, if logged in as coach and creates another candidate's opportunity", async () => {
          const opportunity = await opportunityFactory({}, {}, false);
          const candidateId = otherCandidat.user.id;
          const newOpportunity = {
            title: opportunity.title,
            company: opportunity.company,
            contract: opportunity.contract,
            startOfContract: opportunity.startOfContract,
            endOfContract: opportunity.endOfContract,
            isPartTime: opportunity.isPartTime,
            department: opportunity.department,
            isPublic: opportunity.isPublic,
          };
          delete newOpportunity.title;

          const response = await request(serverTest)
            .post(`${route}/external`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({ candidateId, newOpportunity });

          expect(response.status).toBe(401);
        });

        it('Should return 200, and status be "Contacted", if logged in as admin and valid opportunity', async () => {
          const opportunity = await opportunityFactory({}, {}, false);

          const candidateId = loggedInCandidat.user.id;
          const newOpportunity = {
            title: opportunity.title,
            company: opportunity.company,
            contract: opportunity.contract,
            startOfContract: opportunity.startOfContract,
            endOfContract: opportunity.endOfContract,
            isPartTime: opportunity.isPartTime,
            department: opportunity.department,
          };

          const response = await request(serverTest)
            .post(`${route}/external`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({ candidateId, ...newOpportunity });

          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              ...newOpportunity,
              isExternal: true,
              isPublic: false,
              isValidated: true,
              createdAt: response.body.createdAt,
              updatedAt: response.body.updatedAt,
            })
          );
          expect(response.body.userOpportunity.UserId).toMatch(candidateId);
          // status 0 = "Contacté"
          expect(response.body.userOpportunity.status).toBe(0);
          incrTotalOppsInDB();
        });
        it('Should return 401, if logged in as admin invalid opportunity', async () => {
          const opportunity = await opportunityFactory({}, {}, false);

          const newOpportunity = {
            candidateId: loggedInCandidat.user.id,
            title: opportunity.title,
            company: opportunity.company,
            contract: opportunity.contract,
            startOfContract: opportunity.startOfContract,
            endOfContract: opportunity.endOfContract,
            isPartTime: opportunity.isPartTime,
            department: opportunity.department,
          };

          delete newOpportunity.title;
          const response = await request(serverTest)
            .post(`${route}/external`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send(newOpportunity);
          expect(response.status).toBe(401);
        });
        it('Should return 401, if not logged in', async () => {
          const opportunity = await opportunityFactory({}, {}, false);
          const response = await request(serverTest)
            .post(`${route}/external`)
            .send(opportunity);
          expect(response.status).toBe(401);
        });
      });
      describe('Add a user to an opportunity - /join', () => {
        it('should return 200, if candidat adds himself to an opportunity', async () => {
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
        it('should return 200, if a coach adds his associated candidat to an opportunity', async () => {
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
        it('should return 200, if admin adds candidat to an opportunity', async () => {
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
          const opportunityId = 'ka824df-c9e0-42cb-adb6-02267fc9e5f6';
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
          expect(response.body.offers.length).toBe(getTotalOppsInDB());
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
        describe('Read all opportunities as admin with filters', () => {
          it('should return 200, and all the opportunities that matches the pending filter', async () => {
            const response = await request(serverTest)
              .get(`${route}/admin?type=pending`)
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(11);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isValidated: true,
                }),
                expect.objectContaining({
                  isExternal: true,
                }),
                expect.objectContaining({
                  isArchived: true,
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the validated filter', async () => {
            const response = await request(serverTest)
              .get(`${route}/admin?type=validated`)
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(30);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isValidated: false,
                }),
                expect.objectContaining({
                  isExternal: true,
                }),
                expect.objectContaining({
                  isArchived: true,
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the external filter', async () => {
            const response = await request(serverTest)
              .get(`${route}/admin?type=external`)
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(5);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isValidated: false,
                }),
                expect.objectContaining({
                  isExternal: false,
                }),
                expect.objectContaining({
                  isArchived: false,
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the archived filter', async () => {
            const response = await request(serverTest)
              .get(`${route}/admin?type=archived`)
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(2);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isArchived: false,
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the department filters', async () => {
            const response = await request(serverTest)
              .get(`${route}/admin?department[]=Rhône (69)`)
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(21);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the isPublic filters', async () => {
            const response = await request(serverTest)
              .get(`${route}/admin?isPublic[]=true`)
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(30);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  isPublic: true,
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the businessLines filters', async () => {
            const response = await request(serverTest)
              .get(`${route}/admin?businessLines[]=id`)
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(26);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  businessLines: expect.arrayContaining([
                    expect.objectContaining({ name: 'id' }),
                  ]),
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the status filters', async () => {
            const response = await request(serverTest)
              .get(`${route}/user/all/${loggedInCandidat.user.id}?status[]=1`)
              .set('authorization', `Token ${loggedInCandidat.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(6);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  userOpportunity: expect.objectContaining({
                    status: 1,
                  }),
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the search query', async () => {
            const response = await request(serverTest)
              .get(`${route}/admin?search=Rhône`)
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(21);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the multiple filters (AND between different filters, OR inside each filters)', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/admin?department[]=Rhône (69)&department[]=Paris (75)&isPublic[]=true&type=validated&businessLines[]=id`
              )
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(18);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isValidated: false,
                }),
              ])
            );
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isPublic: false,
                }),
              ])
            );
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }) &&
                  expect.objectContaining({
                    department: 'Paris (75)',
                  }),
              ])
            );
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  businessLines: expect.arrayContaining([
                    expect.objectContaining({ name: 'id' }),
                  ]),
                }),
              ])
            );
          });
        });
      });
      describe('Count all pending opportunities - /admin', () => {
        it('Should return 200 and count of all pending opportunities, if logged in admin', async () => {
          const response = await request(serverTest)
            .get(`${route}/admin/count`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.pendingOpportunities).toBe(2);
        });
        it('Should return 401, if not logged in admin', async () => {
          const response = await request(serverTest)
            .get(`${route}/admin`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(401);
        });
      });

      describe("Read a user's private opportunities - /user/private/:id", () => {
        const userOpportunitiesCount = 26;
        it('should return 200, if candidat read his opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/private/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.offers.length).toBe(userOpportunitiesCount);
        });
        it('should return 200, if a coach read his associated candidat opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/private/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(200);
          expect(response.body.offers.length).toBe(userOpportunitiesCount);
        });
        it('should return 200, if a admin reads candidat opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/private/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.offers.length).toBe(userOpportunitiesCount);
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
        describe("Read user's opportunities with filters as admin", () => {
          it('should return 200, and all the opportunities that matches the hide public filter', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/private/${loggedInCandidat.user.id}?isPublic[]=true`
              )
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(14);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isPublic: false,
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the department filters', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/private/${loggedInCandidat.user.id}?department[]=Rhône (69)`
              )
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(19);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the status filters', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/private/${loggedInCandidat.user.id}?status[]=1`
              )
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(7);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  userOpportunity: expect.arrayContaining([
                    expect.objectContaining({
                      status: 1,
                    }),
                  ]),
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the search query', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/private/${loggedInCandidat.user.id}?search=Rhône`
              )
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(19);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the businessLines filters', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/private/${loggedInCandidat.user.id}?businessLines[]=id`
              )
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(17);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  businessLines: expect.arrayContaining([
                    expect.objectContaining({ name: 'id' }),
                  ]),
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the multiple filters (AND between different filters, OR inside each filters)', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/private/${loggedInCandidat.user.id}?department[]=Rhône (69)&status[]=0&status[]=1&isPublic[]=true&businessLines[]=id`
              )
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(3);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isPublic: false,
                }),
              ])
            );
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  userOpportunity: expect.arrayContaining([
                    expect.objectContaining({
                      status: 0,
                    }) ||
                      expect.objectContaining({
                        status: 1,
                      }),
                  ]),
                }),
              ])
            );
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  businessLines: expect.arrayContaining([
                    expect.objectContaining({ name: 'id' }),
                  ]),
                }),
              ])
            );
          });
        });
      });
      describe("Read all user's opportunities - /user/all/:id", () => {
        const userOpportunitiesCount = 33;
        it('should return 200, if candidat read his opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/all/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.offers.length).toBe(userOpportunitiesCount);
        });
        it('should return 200, if a coach read his associated candidat opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/all/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(200);
          expect(response.body.offers.length).toBe(userOpportunitiesCount);
        });
        it('should return 200, if a admin read a candidates opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/all/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.offers.length).toBe(userOpportunitiesCount);
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

        describe("Read user's opportunities with filters", () => {
          it('should return 200, and all the opportunities that matches the private filter', async () => {
            const response = await request(serverTest)
              .get(`${route}/user/all/${loggedInCandidat.user.id}?type=private`)
              .set('authorization', `Token ${loggedInCandidat.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(11);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isPublic: true,
                }),
                expect.objectContaining({
                  userOpportunity: expect.objectContaining({
                    archived: true,
                  }),
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the public filter', async () => {
            const response = await request(serverTest)
              .get(`${route}/user/all/${loggedInCandidat.user.id}?type=public`)
              .set('authorization', `Token ${loggedInCandidat.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(21);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isPublic: false,
                }),
                expect.objectContaining({
                  userOpportunity: expect.objectContaining({
                    archived: true,
                  }),
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the archived filter', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/all/${loggedInCandidat.user.id}?type=archived`
              )
              .set('authorization', `Token ${loggedInCandidat.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(1);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  userOpportunity: expect.objectContaining({
                    archived: false,
                  }),
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the department filters', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/all/${loggedInCandidat.user.id}?department[]=Rhône (69)`
              )
              .set('authorization', `Token ${loggedInCandidat.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(20);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the businessLines filters', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/all/${loggedInCandidat.user.id}?businessLines[]=id`
              )
              .set('authorization', `Token ${loggedInAdmin.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(24);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  businessLines: expect.arrayContaining([
                    expect.objectContaining({ name: 'id' }),
                  ]),
                }),
              ])
            );
          });
          it("Should return 200, and offers suggestions of different location if the department filters don't match", async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/all/${loggedInCandidat.user.id}?department[]=Rhône (69)&type=private`
              )
              .set('authorization', `Token ${loggedInCandidat.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(4);
            expect(response.body.otherOffers.length).toBe(7);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
            expect(response.body.otherOffers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
            expect(response.body.otherOffers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Paris (75)',
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the status filters', async () => {
            const response = await request(serverTest)
              .get(`${route}/user/all/${loggedInCandidat.user.id}?status[]=1`)
              .set('authorization', `Token ${loggedInCandidat.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(6);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  userOpportunity: expect.objectContaining({
                    status: 1,
                  }),
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the search query', async () => {
            const response = await request(serverTest)
              .get(`${route}/user/all/${loggedInCandidat.user.id}?search=Rhône`)
              .set('authorization', `Token ${loggedInCandidat.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(21);
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
          });
          it('should return 200, and all the opportunities that matches the multiple filters (AND between different filters, OR inside each filters)', async () => {
            const response = await request(serverTest)
              .get(
                `${route}/user/all/${loggedInCandidat.user.id}?department[]=Rhône (69)&status[]=0&status[]=1&type=public&businessLines[]=id`
              )
              .set('authorization', `Token ${loggedInCandidat.token}`);
            expect(response.status).toBe(200);
            expect(response.body.offers.length).toBe(2);
            expect(response.body.offers).not.toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  isPublic: false,
                }),
                expect.objectContaining({
                  userOpportunity: expect.objectContaining({
                    archived: true,
                  }),
                }),
              ])
            );
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  department: 'Rhône (69)',
                }),
              ])
            );
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  userOpportunity:
                    expect.objectContaining({
                      status: 0,
                    }) ||
                    expect.objectContaining({
                      status: 1,
                    }),
                }),
              ])
            );
            expect(response.body.offers).not.toEqual(
              expect.not.arrayContaining([
                expect.objectContaining({
                  businessLines: expect.arrayContaining([
                    expect.objectContaining({ name: 'id' }),
                  ]),
                }),
              ])
            );
          });
        });
      });
      describe("Count all user's opportunities - /user/count/:id", () => {
        const userOpportunitiesCount = 8;
        it('should return 200, if candidat counts his opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/count/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.unseenOpportunities).toBe(
            userOpportunitiesCount
          );
        });
        it('should return 200, if a coach counts his associated candidat opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/count/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(200);
          expect(response.body.unseenOpportunities).toBe(
            userOpportunitiesCount
          );
        });
        it('should return 200, if a admin counts a candidate opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/count/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.unseenOpportunities).toBe(
            userOpportunitiesCount
          );
        });
        it('should return 401, if invalid user id', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/count/a824df-c9e0-42cb-adb6-02267fc9e5f6`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(401);
        });
        it('should return 401, if candidat counts an other candidat opportunities', async () => {
          const response = await request(serverTest)
            .get(`${route}/user/count/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${otherCandidat.token}`);
          expect(response.status).toBe(401);
        });
        it("should return 401, if a coach counts not associate candidat's opportunities", async () => {
          const response = await request(serverTest)
            .get(`${route}/user/count/${otherCandidat.user.id}`)
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
      describe('Update an opportunity - /', () => {
        it('Should return 200, if admin updates an opportunity', async () => {
          const update = {
            ...opportunities[0],
            isValidated: true,
            title: 'updated title',
          };
          const response = await request(serverTest)
            .put(`${route}/`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send(update);
          expect(response.status).toBe(200);
          expect(response.body.title).toBe('updated title');
        });
        it('Should return 200, and updated opportunities ids, if admin bulk updates some opportunities', async () => {
          const originalOpportunities = await createEntities(
            opportunityFactory,
            5,
            {
              isValidated: true,
              isPublic: true,
              isArchived: false,
              department: 'Rhône (69)',
            },
            { businessLines: ['id', 'aa'] },
            true
          );
          const originalOpportunitiesIds = originalOpportunities.map(
            ({ id }) => {
              return id;
            }
          );

          const response = await request(serverTest)
            .put(`${route}/bulk`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({
              attributes: {
                isArchived: true,
              },
              opportunitiesId: originalOpportunitiesIds,
            });

          expect(response.status).toBe(200);

          const { nbUpdated, updatedOffersIds } = response.body;
          const updatedOffers = await models.Opportunity.findAll({
            where: {
              id: originalOpportunitiesIds,
            },
          });

          expect(nbUpdated).toBeLessThanOrEqual(originalOpportunities.length);
          expect(originalOpportunitiesIds).toEqual(
            expect.arrayContaining(updatedOffersIds.sort())
          );
          expect(
            updatedOffers.map((opp) => {
              return opp.toJSON();
            })
          ).toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                isArchived: false,
              }),
            ])
          );
        });
        it('Should return 200, if admin adds a user to a public opportunity', async () => {
          const update = {
            ...opportunities[0],
            candidatesId: [otherCandidat.user.id],
          };
          const response = await request(serverTest)
            .put(`${route}/`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send(update);
          expect(response.status).toBe(200);
          expect(
            response.body.userOpportunity.map((userOpp) => {
              return userOpp.UserId;
            })
          ).toEqual(expect.arrayContaining([otherCandidat.user.id]));
        });
        it('Should return 401, if no an admin', async () => {
          const update = {
            ...opportunities[1],
            isValidated: true,
            title: 'updated title',
          };
          const response = await request(serverTest)
            .put(`${route}/`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send(update);
          expect(response.status).toBe(401);
        });
      });
      describe('Update an external opportunity - /', () => {
        it('Should return 200, if logged in as candidate and updates own opportunity with authorized values', async () => {
          const newTitle = 'Updated title';
          const candidateId = loggedInCandidat.user.id;
          const updatedOpportunity = {
            id: candidatExternalOpportunity.id,
            title: newTitle,
            company: candidatExternalOpportunity.company,
            contract: candidatExternalOpportunity.contract,
            startOfContract: candidatExternalOpportunity.startOfContract,
            endOfContract: candidatExternalOpportunity.endOfContract,
            isPartTime: candidatExternalOpportunity.isPartTime,
            department: candidatExternalOpportunity.department,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({ candidateId, ...updatedOpportunity });
          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              ...updatedOpportunity,
              isExternal: true,
              isPublic: false,
              isValidated: true,
              createdAt: response.body.createdAt,
              updatedAt: response.body.updatedAt,
            })
          );
          expect(response.body.userOpportunity.UserId).toMatch(candidateId);
        });
        it('Should return 401, if logged in as candidate and updates own opportunity with unauthorized values', async () => {
          const newTitle = 'updated title';
          const candidateId = loggedInCandidat.user.id;
          const updatedOpportunity = {
            title: newTitle,
            company: candidatExternalOpportunity.company,
            contract: candidatExternalOpportunity.contract,
            startOfContract: candidatExternalOpportunity.startOfContract,
            endOfContract: candidatExternalOpportunity.endOfContract,
            isPartTime: candidatExternalOpportunity.isPartTime,
            department: candidatExternalOpportunity.department,
            isPublic: true,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({ candidateId, ...updatedOpportunity });
          expect(response.status).toBe(401);
        });
        it('Should return 401, if logged in as candidate and updates somebody elses opportunity', async () => {
          const newTitle = 'updated title';
          const candidateId = otherCandidat.user.id;
          const updatedOpportunity = {
            id: otherCandidatExternalOpportunity.id,
            title: newTitle,
            company: otherCandidatExternalOpportunity.company,
            contract: otherCandidatExternalOpportunity.contract,
            startOfContract: otherCandidatExternalOpportunity.startOfContract,
            endOfContract: otherCandidatExternalOpportunity.endOfContract,
            isPartTime: otherCandidatExternalOpportunity.isPartTime,
            department: otherCandidatExternalOpportunity.department,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({ candidateId, ...updatedOpportunity });
          expect(response.status).toBe(401);
        });
        it('Should return 401, if logged in as candidate and updates non external opportunity', async () => {
          const newTitle = 'updated title';

          const candidateId = loggedInCandidat.user.id;
          const updatedOpportunity = {
            id: opportunities[0].id,
            title: newTitle,
            company: opportunities[0].company,
            contract: opportunities[0].contract,
            startOfContract: opportunities[0].startOfContract,
            endOfContract: opportunities[0].endOfContract,
            isPartTime: opportunities[0].isPartTime,
            department: opportunities[0].department,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({ candidateId, ...updatedOpportunity });
          expect(response.status).toBe(401);
        });

        it('Should return 200, if logged in as coach and updates own candidate opportunity with authorized values', async () => {
          const newTitle = 'Updated title';
          const candidateId = loggedInCandidat.user.id;
          const updatedOpportunity = {
            id: candidatExternalOpportunity.id,
            title: newTitle,
            company: candidatExternalOpportunity.company,
            contract: candidatExternalOpportunity.contract,
            startOfContract: candidatExternalOpportunity.startOfContract,
            endOfContract: candidatExternalOpportunity.endOfContract,
            isPartTime: candidatExternalOpportunity.isPartTime,
            department: candidatExternalOpportunity.department,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({ candidateId, ...updatedOpportunity });
          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              ...updatedOpportunity,
              isExternal: true,
              isPublic: false,
              isValidated: true,
              createdAt: response.body.createdAt,
              updatedAt: response.body.updatedAt,
            })
          );
          expect(response.body.userOpportunity.UserId).toMatch(candidateId);
        });
        it("Should return 401, if logged in as coach and creates another candidate's opportunity", async () => {
          const newTitle = 'updated title';

          const candidateId = otherCandidat.user.id;
          const updatedOpportunity = {
            id: otherCandidatExternalOpportunity.id,
            title: newTitle,
            company: otherCandidatExternalOpportunity.company,
            contract: otherCandidatExternalOpportunity.contract,
            startOfContract: otherCandidatExternalOpportunity.startOfContract,
            endOfContract: otherCandidatExternalOpportunity.endOfContract,
            isPartTime: otherCandidatExternalOpportunity.isPartTime,
            department: otherCandidatExternalOpportunity.department,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({ candidateId, ...updatedOpportunity });
          expect(response.status).toBe(401);
        });

        it('Should return 200, if logged in as admin and updates opportunity', async () => {
          const newTitle = 'updated title';
          const candidateId = loggedInCandidat.user.id;
          const updatedOpportunity = {
            id: candidatExternalOpportunity.id,
            title: newTitle,
            company: candidatExternalOpportunity.company,
            contract: candidatExternalOpportunity.contract,
            startOfContract: candidatExternalOpportunity.startOfContract,
            endOfContract: candidatExternalOpportunity.endOfContract,
            isPartTime: candidatExternalOpportunity.isPartTime,
            department: candidatExternalOpportunity.department,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({ candidateId, ...updatedOpportunity });
          expect(response.status).toBe(200);
          expect(response.body).toEqual(
            expect.objectContaining({
              ...updatedOpportunity,
              isExternal: true,
              isPublic: false,
              isValidated: true,
              createdAt: response.body.createdAt,
              updatedAt: response.body.updatedAt,
              date: response.body.date,
            })
          );
          expect(response.body.userOpportunity.UserId).toMatch(candidateId);
        });
        it('Should return 401, if logged in as admin and updates non external opportunity', async () => {
          const newTitle = 'updated title';
          const candidateId = loggedInCandidat.user.id;
          const updatedOpportunity = {
            ...opportunities[0],
            title: newTitle,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({ candidateId, ...updatedOpportunity });
          expect(response.status).toBe(401);
        });
        it('Should return 401, if logged in as admin and updates opportunity without candidateId', async () => {
          const newTitle = 'updated title';
          const updatedOpportunity = {
            ...opportunities[0],
            title: newTitle,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send(updatedOpportunity);
          expect(response.status).toBe(401);
        });

        it('Should return 401, if not logged in', async () => {
          const newTitle = 'updated title';
          const candidateId = loggedInCandidat.user.id;
          const updatedOpportunity = {
            ...opportunities[0],
            title: newTitle,
          };
          const response = await request(serverTest)
            .put(`${route}/external`)
            .send({ candidateId, ...updatedOpportunity });
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
    describe.skip('D - Delete 1', () => {
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
