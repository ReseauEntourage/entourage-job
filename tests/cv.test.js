import { CV_STATUS, USER_ROLES } from 'src/constants';
import cvFactory from 'tests/factories/cvFactory';
import userFactory from 'tests/factories/userFactory';

import request from 'supertest';

import {
  associateCoachAndCandidat,
  createLoggedInUser,
  getCandidatUrl,
  getTestImagePath,
  recreateTestDB,
  resetTestDB,
  startTestServer,
  stopTestServer,
} from 'tests/helpers';

describe('CV', () => {
  const route = '/api/v1/cv';
  let serverTest;
  let loggedInAdmin;
  let loggedInCandidat;
  let loggedInCoach;
  let candidatCV;
  let cvCandidat;
  let path;

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
    candidatCV = await userFactory({
      role: USER_ROLES.CANDIDAT,
      password: 'candidatCV',
    });
    cvCandidat = await cvFactory({
      status: CV_STATUS.Published.value,
      UserId: candidatCV.id,
    });
    admin.password = 'admin';
    coach.password = 'coach';
    candidat.password = 'candidat';
    await associateCoachAndCandidat(coach, candidat);
    loggedInAdmin = await createLoggedInUser(admin, {}, false);
    loggedInCoach = await createLoggedInUser(coach, {}, false);
    loggedInCandidat = await createLoggedInUser(candidat, {}, false);

    path = getTestImagePath();
  });

  afterAll(async () => {
    // deleteTestImage(path);
    await resetTestDB();
    await stopTestServer();
  });
  describe('CRUD CV', () => {
    describe('C - Create 1 CV', () => {
      it('Should return 200 and CV with cv status set as progress if logged in user', async () => {
        const cv = await cvFactory(
          {
            UserId: loggedInCandidat.user.id,
          },
          {},
          false
        );
        const cvResponse = {
          ...cv,
          status: CV_STATUS.Progress.value,
        };
        delete cvResponse.status;
        const response = await request(serverTest)
          .post(`${route}/`)
          .set('authorization', `Token ${loggedInCandidat.token}`)
          .set('Content-Type', 'multipart/form-data')
          .field('cv', JSON.stringify(cv))
          .attach('profileImage', path);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(cvResponse);
      });

      it('Should return 200 and cvHasBeenModified, if coach checks if CV has been updated', async () => {
        const response = await request(serverTest)
          .get(`${route}/checkUpdate`)
          .set('authorization', `Token ${loggedInCoach.token}`);
        expect(response.status).toBe(200);
        expect(response.body.cvHasBeenModified).toBe(true);
      });
      it('Should return 200 and cvHasBeenModified be false, if coach reads CV', async () => {
        const setHasReadCVRequest = await request(serverTest)
          .put(`${route}/read/${loggedInCandidat.user.id}`)
          .set('authorization', `Token ${loggedInCoach.token}`);
        expect(setHasReadCVRequest.status).toBe(200);

        const response = await request(serverTest)
          .get(`${route}/checkUpdate`)
          .set('authorization', `Token ${loggedInCoach.token}`);
        expect(response.status).toBe(200);
        expect(response.body.cvHasBeenModified).toBe(false);
      });

      it("Should return 200 and CV with cv status set as progress, if logged in user is coach of cv's owner", async () => {
        const cv = await cvFactory(
          {
            UserId: loggedInCandidat.user.id,
            urlImg: null,
          },
          {},
          false
        );
        cv.status = undefined;
        const response = await request(serverTest)
          .post(`${route}/`)
          .set('authorization', `Token ${loggedInCoach.token}`)
          .field('cv', JSON.stringify(cv))
          .attach('profileImage', path);
        expect(response.status).toBe(200);
        expect(response.body.status).toMatch(CV_STATUS.Progress.value);
      });
      it("Should return 200 and CV with cv status set as pending if CV submitted, if logged in user is coach of cv's owner", async () => {
        const cv = await cvFactory(
          {
            UserId: loggedInCandidat.user.id,
            urlImg: null,
          },
          {},
          false
        );
        cv.status = CV_STATUS.Pending.value;
        const response = await request(serverTest)
          .post(`${route}/`)
          .set('authorization', `Token ${loggedInCoach.token}`)
          .field('cv', JSON.stringify(cv))
          .attach('profileImage', path);
        expect(response.status).toBe(200);
        expect(response.body.status).toMatch(CV_STATUS.Pending.value);
      });

      it('Should return 200 and cvHasBeenModified, if candidat checks if CV has been updated', async () => {
        const response = await request(serverTest)
          .get(`${route}/checkUpdate`)
          .set('authorization', `Token ${loggedInCandidat.token}`);
        expect(response.status).toBe(200);
        expect(response.body.cvHasBeenModified).toBe(true);
      });

      it('Should return 200 and cvHasBeenModified be false, if candidat reads CV', async () => {
        const setHasReadCVRequest = await request(serverTest)
          .put(`${route}/read/${loggedInCandidat.user.id}`)
          .set('authorization', `Token ${loggedInCandidat.token}`);
        expect(setHasReadCVRequest.status).toBe(200);

        const response = await request(serverTest)
          .get(`${route}/checkUpdate`)
          .set('authorization', `Token ${loggedInCandidat.token}`);
        expect(response.status).toBe(200);
        expect(response.body.cvHasBeenModified).toBe(false);
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
        };
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
        const cv = await cvFactory(
          { UserId: loggedInCandidat.user.id },
          {},
          false
        );
        const response = await request(serverTest)
          .post(`${route}/`)
          .send({ cv });
        expect(response.status).toBe(401);
      });
    });
    describe('R - Read 1 CV', () => {
      describe(' Get a CV by user id - /?userId', () => {
        it('Should return 200 if valid user id provided', async () => {
          const response = await request(serverTest).get(
            `${route}/?userId=${loggedInCandidat.user.id}`
          );
          expect(response.body.UserId).toBe(loggedInCandidat.user.id);
          expect(response.status).toBe(200);
        });
        it("Should return 204 if valid user id provided and candidat doesn't have a CV", async () => {
          const candidatNoCv = await createLoggedInUser({
            role: USER_ROLES.CANDIDAT,
            password: 'candidatNoCv',
          });
          const response = await request(serverTest).get(
            `${route}/?userId=${candidatNoCv.user.id}`
          );
          expect(response.status).toBe(204);
        });
        it.skip('Should return 401 if invalid user id provided', async () => {
          const response = await request(serverTest).get(
            `${route}/?userId=123-fakeuserid`
          );
          expect(response.status).toBe(401);
        });
      });
      describe("Get a CV by candidat's url - /", () => {
        it("Should return 200 if valid candidat's url provided", async () => {
          const candidatUrl = await getCandidatUrl(candidatCV.id);
          console.log({
            cvUserId: cvCandidat.UserId,
            cvStatus: cvCandidat.status,
            userUrl: candidatUrl,
            userId: candidatCV.id,
          });
          const response = await request(serverTest)
            .get(`${route}/${candidatUrl}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.cv.UserId).toBe(candidatCV.id);
          expect(response.body.exists).toBe(true);
        });
        it('Should return 200 if valid url provided and candidat has hidden CV', async () => {
          const candidatNoCv = await createLoggedInUser({
            role: USER_ROLES.CANDIDAT,
            password: 'candidatNoCv',
          });
          const candidatNoCvUrl = await getCandidatUrl(candidatNoCv.user.id);
          const response = await request(serverTest).get(
            `${route}/${candidatNoCvUrl}`
          );
          expect(response.status).toBe(200);
          expect(response.body.cv).toBe(undefined);
          expect(response.body.exists).toBe(true);
        });
        it.skip("Should return 401 if candidat's url is invalid", async () => {
          const response = await request(serverTest).get(
            `${route}/fakeuser-1234553`
          );
          expect(response.status).toBe(401);
        });
      });
    });
    describe('R - Read List of CVs', () => {
      describe('Get a list n random cv matching a search - /cards/random/?nb=&search=', () => {
        it('Should return 200, and 1 cv', async () => {
          const response = await request(serverTest).get(
            `${route}/cards/random/?nb=2`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(2);
        });
        it("Should return 200, and 1 cv if user's first name or other property contains the query", async () => {
          const newUser = await userFactory({
            firstName: 'xxxxKnownFirstNamexxxx',
            role: USER_ROLES.CANDIDAT,
          });
          const newCV = await cvFactory({
            status: CV_STATUS.Published.value,
            UserId: newUser.id,
            firstName: newUser.firstName,
          });
          const response = await request(serverTest).get(
            `${route}/cards/random/?nb=1&search=xxxxKnownFirstNamexxxx`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(1);
          expect(response.body.cvs[0].id).toBe(newCV.id);
        });
        it('Should return 200 and empty list, if no result found', async () => {
          const response = await request(serverTest).get(
            `${route}/cards/random/?nb=1&search=zzzzzzz`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(0);
        });
        it('Should return 200 and many cv, if no nb provided', async () => {
          const response = await request(serverTest).get(
            `${route}/cards/random/`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(3);
        });
      });
      describe('Get a list of cvs matching specific filters', () => {
        it('Should return 200, and all the cvs that matches the location filters', async () => {
          const newUser1 = await userFactory({
            role: USER_ROLES.CANDIDAT,
          });
          const newCV1 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser1.id,
              firstName: newUser1.firstName,
            },
            {
              locations: ['Paris (75)'],
            }
          );
          const newUser2 = await userFactory({
            role: USER_ROLES.CANDIDAT,
          });
          const newCV2 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser2.id,
              firstName: newUser2.firstName,
            },
            {
              locations: ['Rhône (69)'],
            }
          );
          const newUser3 = await userFactory({
            role: USER_ROLES.CANDIDAT,
          });
          const newCV3 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser3.id,
              firstName: newUser3.firstName,
            },
            {
              locations: ['Nord (59)'],
            }
          );
          const response = await request(serverTest).get(
            `${route}/cards/random/?locations[]=Île-de-France&locations[]=Auvergne-Rhône-Alpes`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(2);
          expect(response.body.cvs).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: newCV1.id,
              }),
              expect.objectContaining({
                id: newCV2.id,
              }),
            ])
          );
          expect(response.body.cvs).not.toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: newCV3.id,
              }),
            ])
          );
        });
        it('Should return 200, and all the cvs that matches the employed filters', async () => {
          const newUser1 = await userFactory(
            {
              role: USER_ROLES.CANDIDAT,
            },
            {
              employed: false,
            }
          );
          const newCV1 = await cvFactory({
            status: CV_STATUS.Published.value,
            UserId: newUser1.id,
            firstName: newUser1.firstName,
          });
          const newUser2 = await userFactory(
            {
              role: USER_ROLES.CANDIDAT,
            },
            {
              employed: false,
            }
          );
          const newCV2 = await cvFactory({
            status: CV_STATUS.Published.value,
            UserId: newUser2.id,
            firstName: newUser2.firstName,
          });
          const newUser3 = await userFactory(
            {
              role: USER_ROLES.CANDIDAT,
            },
            {
              employed: true,
            }
          );
          const newCV3 = await cvFactory({
            status: CV_STATUS.Published.value,
            UserId: newUser3.id,
            firstName: newUser3.firstName,
          });
          const response = await request(serverTest).get(
            `${route}/cards/random/?employed[]=false`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(8);
          expect(response.body.cvs).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: newCV1.id,
              }),
              expect.objectContaining({
                id: newCV2.id,
              }),
            ])
          );
          expect(response.body.cvs).not.toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: newCV3.id,
              }),
            ])
          );
        });
        it('Should return 200, and all the cvs that matches the businessLine filters', async () => {
          const newUser1 = await userFactory({
            role: USER_ROLES.CANDIDAT,
          });
          const newCV1 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser1.id,
              firstName: newUser1.firstName,
            },
            {
              businessLines: ['id'],
            }
          );
          const newUser2 = await userFactory({
            role: USER_ROLES.CANDIDAT,
          });
          const newCV2 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser2.id,
              firstName: newUser2.firstName,
            },
            {
              businessLines: ['bat'],
            }
          );
          const newUser3 = await userFactory({
            role: USER_ROLES.CANDIDAT,
          });
          const newCV3 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser3.id,
              firstName: newUser3.firstName,
            },
            {
              businessLines: ['sa'],
            }
          );
          const response = await request(serverTest).get(
            `${route}/cards/random/?businessLines[]=bat&businessLines[]=id`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(2);
          expect(response.body.cvs).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: newCV1.id,
              }),
              expect.objectContaining({
                id: newCV2.id,
              }),
            ])
          );
          expect(response.body.cvs).not.toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: newCV3.id,
              }),
            ])
          );
        });
        it('Should return 200, and all the cvs that matches multiple filters (AND between different filters, OR inside each filters)', async () => {
          const newUser1 = await userFactory(
            {
              role: USER_ROLES.CANDIDAT,
            },
            {
              employed: false,
            }
          );
          const newCV1 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser1.id,
              firstName: newUser1.firstName,
            },
            {
              businessLines: ['id'],
              locations: ['Paris (75)'],
            }
          );
          const newUser2 = await userFactory(
            {
              role: USER_ROLES.CANDIDAT,
            },
            {
              employed: false,
            }
          );
          const newCV2 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser2.id,
              firstName: newUser2.firstName,
            },
            {
              businessLines: ['bat'],
              locations: ['Rhône (69)'],
            }
          );
          const newUser3 = await userFactory(
            {
              role: USER_ROLES.CANDIDAT,
            },
            {
              employed: true,
            }
          );
          const newCV3 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser3.id,
              firstName: newUser3.firstName,
            },
            {
              businessLines: ['sa'],
              locations: ['Nord (59)'],
            }
          );
          const response = await request(serverTest).get(
            `${route}/cards/random/?businessLines[]=sa&businessLines[]=id&employed[]=false&locations[]=Auvergne-Rhône-Alpes&locations[]=Hauts-de-France&locations[]=Île-de-France`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(1);
          expect(response.body.cvs).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: newCV1.id,
              }),
            ])
          );
          expect(response.body.cvs).not.toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: newCV3.id,
              }),
              expect.objectContaining({
                id: newCV2.id,
              }),
            ])
          );
        });
        it("Should return 200, and cvs suggestions of same location if the businessLine filter doesn't match", async () => {
          const newUser1 = await userFactory(
            {
              role: USER_ROLES.CANDIDAT,
            },
            {
              enmployed: false,
            }
          );
          const newCV1 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser1.id,
              firstName: newUser1.firstName,
            },
            {
              businessLines: ['id'],
              locations: ['Paris (75)'],
            }
          );
          const newUser2 = await userFactory(
            {
              role: USER_ROLES.CANDIDAT,
            },
            {
              employed: false,
            }
          );
          const newCV2 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser2.id,
              firstName: newUser2.firstName,
            },
            {
              businessLines: ['bat'],
              locations: ['Paris (75)'],
            }
          );
          const newUser3 = await userFactory(
            {
              role: USER_ROLES.CANDIDAT,
            },
            {
              employed: false,
            }
          );
          const newCV3 = await cvFactory(
            {
              status: CV_STATUS.Published.value,
              UserId: newUser3.id,
              firstName: newUser3.firstName,
            },
            {
              businessLines: ['sa'],
              locations: ['Paris (75)'],
            }
          );
          const response = await request(serverTest).get(
            `${route}/cards/random/?businessLines[]=tra&employed[]=false&locations[]=Île-de-France`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(5);
          expect(response.body.suggestions).toBe(true);
          expect(response.body.cvs).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: newCV1.id,
              }),
              expect.objectContaining({
                id: newCV2.id,
              }),
              expect.objectContaining({
                id: newCV3.id,
              }),
            ])
          );
        });

        it('Should return 200 and empty list, if no result found', async () => {
          const response = await request(serverTest).get(
            `${route}/cards/random/?locations[]=Bretagne`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(0);
        });
        it('Should return 200 and many cv, if no nb provided', async () => {
          const response = await request(serverTest).get(
            `${route}/cards/random/`
          );
          expect(response.status).toBe(200);
          expect(response.body.cvs.length).toBe(18);
        });
      });
    });
    describe('R - Read number of shares', () => {
      it('Should return 200 and the number of shares', async () => {
        const response = await request(serverTest).get(`${route}/shares`);
        expect(response.status).toBe(200);
        expect(response.body.total).toBeTruthy();
      });
    });
    describe.skip('D - Delete 1 CV', () => {
      it('Should return 200, if logged in admin', async () => {
        const cv = await cvFactory({
          UserId: loggedInCandidat.user.id,
        });
        const response = await request(serverTest)
          .delete(`${route}/${cv.id}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
      });
      it('Should return 401, if cv not found', async () => {
        const response = await request(serverTest).delete(
          `${route}/3394b06e-b4eb-4a69-aba9-278ac1d9e1aa`
        );
        expect(response.status).toBe(401);
      });
      it('Should return 401, if not logged in admin', async () => {
        const cv = await cvFactory({
          UserId: loggedInCandidat.user.id,
        });
        const response = await request(serverTest).delete(`${route}/${cv.id}`);
        expect(response.status).toBe(401);
      });
    });
  });
});
