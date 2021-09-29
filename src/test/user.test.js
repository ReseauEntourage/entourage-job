import { USER_ROLES, CV_STATUS } from 'src/constants';
import userFactory from 'src/test/factories/userFactory';
import cvFactory from 'src/test/factories/cvFactory';

import request from 'supertest';

import {
  startTestServer,
  recreateTestDB,
  stopTestServer,
  resetTestDB,
  createCvWithAssociations,
  createLoggedInUser,
  associateCoachAndCandidat,
} from 'src/test/helpers';
import { ADMIN_ZONES } from 'src/constants/departements';

const route = '/api/v1/user';
const cvRoute = '/api/v1/cv';
let serverTest;
const fakeId = '9bc0065e-b889-4f05-97v8-73i45f49976a';
let loggedInAdmin;
let loggedInCoach;
let loggedInCandidat;
let otherLoggedInCandidat;
let otherLoggedInCoach;

describe('User', () => {
  beforeAll(async () => {
    serverTest = await startTestServer();
    await recreateTestDB();
    const admin = await userFactory({
      role: USER_ROLES.ADMIN,
      password: 'admin',
      zone: ADMIN_ZONES.LILLE,
    });
    const coach = await userFactory({
      role: USER_ROLES.COACH,
      password: 'coach',
      zone: ADMIN_ZONES.LYON,
    });
    const candidat = await userFactory(
      {
        role: USER_ROLES.CANDIDAT,
        password: 'candidat',
        zone: ADMIN_ZONES.LYON,
      },
      {
        hidden: false,
        employed: false,
      }
    );
    admin.password = 'admin';
    coach.password = 'coach';
    candidat.password = 'candidat';
    await associateCoachAndCandidat(coach, candidat);
    loggedInAdmin = await createLoggedInUser(admin, {}, false);
    loggedInCoach = await createLoggedInUser(coach, {}, false);
    loggedInCandidat = await createLoggedInUser(candidat, {}, false);
    otherLoggedInCandidat = await createLoggedInUser(
      {
        role: USER_ROLES.CANDIDAT,
        password: 'otherCandidate',
        zone: ADMIN_ZONES.LILLE,
      },
      {
        hidden: true,
        employed: true,
      }
    );
    otherLoggedInCoach = await createLoggedInUser({
      role: USER_ROLES.COACH,
      password: 'otherCoach',
      zone: ADMIN_ZONES.LILLE,
    });

    await associateCoachAndCandidat(
      otherLoggedInCoach.user,
      otherLoggedInCandidat.user,
      true
    );

    const thirdCandidat = await createLoggedInUser(
      {
        role: USER_ROLES.CANDIDAT,
        password: 'thirdCandidate',
        zone: ADMIN_ZONES.LYON,
      },
      {
        hidden: false,
        employed: true,
      }
    );
    await createLoggedInUser({
      role: USER_ROLES.COACH,
      password: 'thirdCoach',
      zone: ADMIN_ZONES.LYON,
    });

    await createCvWithAssociations({
      UserId: loggedInCandidat.user.id,
      status: CV_STATUS.Published.value,
    });

    await createCvWithAssociations({
      UserId: otherLoggedInCandidat.user.id,
      status: CV_STATUS.Pending.value,
    });

    await createCvWithAssociations({
      UserId: thirdCandidat.user.id,
      status: CV_STATUS.Published.value,
    });

    // userAndCvList = await createEntities(createCvWithAssociations, 6, {});
  });

  afterAll(async () => {
    await resetTestDB();
    await stopTestServer();
  });

  describe('CRUD User', () => {
    describe('C - Create 1 User', () => {
      it('Should return 200 and a created user (create user with password).', async () => {
        const candidat = await userFactory(
          {
            role: USER_ROLES.CANDIDAT,
          },
          {},
          false
        );
        const response = await request(serverTest)
          .post(`${route}`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(candidat);
        expect(response.status).toBe(200);
      });
      it('Should return 200 and a created user (create user without password).', async () => {
        const candidat = await userFactory(
          { role: USER_ROLES.CANDIDAT },
          {},
          false
        );
        delete candidat.password;
        delete candidat.hash;
        const response = await request(serverTest)
          .post(`${route}`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(candidat);
        expect(response.status).toBe(200);
      });
      it('Should return 401 when user data contain wrong data types', async () => {
        const wrongData = {
          ...(await userFactory({}, {}, false)),
          firstName: 123,
        };
        const response = await request(serverTest)
          .post(`${route}`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(wrongData);
        expect(response.status).toBe(401);
      });
      it('Should return 401 when the user is not logged-in.', async () => {
        const candidat = userFactory(
          {
            role: USER_ROLES.CANDIDAT,
          },
          {},
          false
        );
        const response = await request(serverTest)
          .post(`${route}`)
          .send(candidat);
        expect(response.status).toBe(401);
      });
      it('Should return 401 when the user is not an administrator.', async () => {
        const candidat = await userFactory(
          {
            role: USER_ROLES.CANDIDAT,
          },
          {},
          false
        );
        const response = await request(serverTest)
          .post(`${route}`)
          .set('authorization', `Token ${loggedInCandidat.token}`)
          .send(candidat);
        expect(response.status).toBe(401);
      });
      it('Should return 409 when the email already exist.', async () => {
        const candidat = await userFactory(
          {
            role: USER_ROLES.CANDIDAT,
          },
          {},
          true
        );
        const response = await request(serverTest)
          .post(`${route}`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(candidat);
        expect(response.status).toBe(409);
      });
    });
    describe('R - Read 1 User', () => {
      describe('/ - Get a user by ID or EMAIL', () => {
        it('Should return 401 when the user is not logged in.', async () => {
          const response = await request(serverTest).get(
            `${route}/${otherLoggedInCandidat.user.email}`
          );
          expect(response.status).toBe(401);
        });
        it('Should return 200 when logged-in candidat get himself', async () => {
          const response = await request(serverTest)
            .get(`${route}/${loggedInCandidat.user.email}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.email).toEqual(loggedInCandidat.user.email);
        });
        it('Should return 200 when logged-in coach get himself', async () => {
          const response = await request(serverTest)
            .get(`${route}/${loggedInCoach.user.email}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(200);
          expect(response.body.email).toEqual(loggedInCoach.user.email);
        });
        it('Should return 401 when logged-in coach get a candidat', async () => {
          const response = await request(serverTest)
            .get(`${route}/${otherLoggedInCandidat.user.email}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(401);
        });
        it('Should return 200 and get a user by email.', async () => {
          const response = await request(serverTest)
            .get(`${route}/${otherLoggedInCandidat.user.email}`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          const receivedUser = response.body;
          expect(receivedUser.email).toEqual(otherLoggedInCandidat.user.email);
        });
        it('Should return 200 and get a user by id.', async () => {
          const response = await request(serverTest)
            .get(`${route}/${otherLoggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.id).toEqual(otherLoggedInCandidat.user.id);
        });
        it('Should return 404 if user not found', async () => {
          const response = await request(serverTest)
            .get(`${route}/${fakeId}`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(404);
        });
      });

      describe('Candidat - get user associated to a candidate or coach', () => {
        it('Should return 401 if user is not  a logged in user', async () => {
          const response = await request(serverTest)
            .get(`${route}/candidat`)
            .send({
              candidatId: loggedInCandidat.user.id,
            });
          expect(response.status).toBe(401);
        });
        it('Should return 200 and users, candidat searching for himself', async () => {
          const response = await request(serverTest)
            .get(`${route}/candidat`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .query({
              candidatId: loggedInCandidat.user.id,
            });

          expect(response.status).toBe(200);
        });
        it('Should return 200 and users, coach searching for himself', async () => {
          const response = await request(serverTest)
            .get(`${route}/candidat`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .query({
              coachId: loggedInCoach.user.id,
            });

          expect(response.status).toBe(200);
        });
        it('Should return 401 if a not admin user search fro others than himself.', async () => {
          const response = await request(serverTest)
            .get(`${route}/candidat`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .query({
              coachId: loggedInCandidat.user.id,
            });

          expect(response.status).toBe(401);
        });
        it('Should return 200 and users, admin searching for any users', async () => {
          const response = await request(serverTest)
            .get(`${route}/candidat`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({
              candidatId: loggedInCoach.user.id,
            });
          expect(response.status).toBe(200);
        });
      });
    });
    describe('R - Many Users', () => {
      describe('Search - search a user where query string in email, first name or last name', () => {
        it('Should return 200 and part of candidates if user is logged in as admin', async () => {
          const candidat = await userFactory({
            role: USER_ROLES.CANDIDAT,
            password: 'candidat',
          });

          await cvFactory({
            UserId: candidat.id,
            status: CV_STATUS.Published.value,
          });

          const privateCandidateInfo = [
            {
              id: candidat.id,
              firstName: candidat.firstName,
              lastName: candidat.lastName,
              role: candidat.role,
              adminRole: candidat.adminRole,
              address: candidat.address,
              deletedAt: candidat.deletedAt,
              email: candidat.email,
              gender: candidat.gender,
              lastConnection: candidat.lastConnection.toISOString(),
              phone: candidat.phone,
              zone: candidat.zone,
            },
          ];

          const response = await request(serverTest)
            .get(`${route}/search?query=${candidat.firstName}`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({
              ...loggedInAdmin.user,
            });

          expect(response.status).toBe(200);
          expect(response.body).toStrictEqual(privateCandidateInfo);
        });
        it('Should return 401 if user is not logged in as admin', async () => {
          const response = await request(serverTest)
            .get(`${route}/search?query=e&role=${USER_ROLES.CANDIDAT}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              ...loggedInCandidat.user,
            });
          expect(response.status).toBe(401);
        });
      });
      describe('Search - search a public candidate where query string in email, first name or last name', () => {
        it('Should return 200 and part of candidates', async () => {
          const candidat = await userFactory({
            role: USER_ROLES.CANDIDAT,
            password: 'candidat',
          });

          await cvFactory({
            UserId: candidat.id,
            status: CV_STATUS.Published.value,
          });

          const publicCandidateInfo = [
            {
              id: candidat.id,
              firstName: candidat.firstName,
              lastName: candidat.lastName,
              role: candidat.role,
            },
          ];

          const response = await request(serverTest).get(
            `${route}/search/candidates?query=${candidat.firstName}`
          );

          expect(response.status).toBe(200);
          expect(response.body).toStrictEqual(publicCandidateInfo);
        });
      });

      describe('Members - get paginated and sorted users', () => {
        it('Should return 401 if user is not a logged in admin', async () => {
          const response = await request(serverTest)
            .get(`${route}/members`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(401);
        });
        it('Should return 200 and a page of the 2th candidats', async () => {
          const response = await request(serverTest)
            .get(`${route}/members?limit=2&role=${USER_ROLES.CANDIDAT}`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(2);
        });
        it('Should return 200 and a page of 3 COACH', async () => {
          const response = await request(serverTest)
            .get(`${route}/members?limit=10&role=${USER_ROLES.COACH}`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
        });
        it('Should return 200 and the 4th and 5th candidats users', async () => {
          await request(serverTest)
            .get(
              `${route}/members?limit=2&offset=2&role=${USER_ROLES.CANDIDAT}`
            )
            .set('authorization', `Token ${loggedInAdmin.token}`);
        });
      });
      describe('Members - Count all pending members', () => {
        it('Should return 401 if user is not a logged in admin', async () => {
          const response = await request(serverTest)
            .get(`${route}/members/count`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(401);
        });
        it('Should return 200 and count of members with pending CVs', async () => {
          const response = await request(serverTest)
            .get(`${route}/members/count`)
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.pendingCVs).toBe(1);
        });
      });

      describe('Read all members as admin with filters', () => {
        it('should return 200, and all the candidates that matches the zone filter', async () => {
          const response = await request(serverTest)
            .get(
              `${route}/members?limit=2&role=${USER_ROLES.CANDIDAT}&zone[]=LYON`
            )
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(2);
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                zone: 'LYON',
              }),
            ])
          );
        });
        it('should return 200, and all the coaches that matches the zone filter', async () => {
          const response = await request(serverTest)
            .get(
              `${route}/members?limit=50&role=${USER_ROLES.COACH}&zone[]=LYON`
            )
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(2);
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                zone: 'LYON',
              }),
            ])
          );
        });
        it('should return 200, and all the candidates that matches the hidden filter', async () => {
          const response = await request(serverTest)
            .get(
              `${route}/members?limit=50&role=${USER_ROLES.CANDIDAT}&hidden[]=true`
            )
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                candidat: expect.objectContaining({
                  hidden: true,
                }),
              }),
            ])
          );
        });
        it('should return 200, and all the candidates that matches the employed filter', async () => {
          const response = await request(serverTest)
            .get(
              `${route}/members?limit=50&role=${USER_ROLES.CANDIDAT}&employed[]=true`
            )
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(2);
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                candidat: expect.objectContaining({
                  employed: true,
                }),
              }),
            ])
          );
        });
        it('should return 200, and all the candidates that matches the cvStatus filters', async () => {
          const response = await request(serverTest)
            .get(
              `${route}/members?limit=50&role=${USER_ROLES.CANDIDAT}&cvStatus[]=Published`
            )
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(4);
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                candidat: expect.objectContaining({
                  cvs: expect.arrayContaining([
                    expect.objectContaining({ status: 'Published' }),
                  ]),
                }),
              }),
            ])
          );
        });
        it('should return 200, and all the candidates that matches the associatedUser filters', async () => {
          const response = await request(serverTest)
            .get(
              `${route}/members?limit=50&role=${USER_ROLES.CANDIDAT}&associatedUser[]=false`
            )
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(6);
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                candidat: expect.objectContaining({
                  coach: null,
                }),
              }),
            ])
          );
        });
        it('should return 200, and all the coaches that matches the associatedUser filters', async () => {
          const response = await request(serverTest)
            .get(
              `${route}/members?limit=50&role=${USER_ROLES.COACH}&associatedUser[]=false`
            )
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                coach: null,
              }),
            ])
          );
        });
        it('should return 200, and all the candidates that matches the multiple filters (AND between different filters, OR inside each filters)', async () => {
          const response = await request(serverTest)
            .get(
              `${route}/members?limit=50&role=${USER_ROLES.CANDIDAT}&zone[]=LYON&associatedUser[]=true&employed[]=false&hidden[]=false`
            )
            .set('authorization', `Token ${loggedInAdmin.token}`);
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                zone: 'LYON',
              }),
            ])
          );
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                candidat: expect.objectContaining({
                  hidden: false,
                }),
              }),
            ])
          );
          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                candidat: expect.objectContaining({
                  employed: false,
                }),
              }),
            ])
          );

          expect(response.body).not.toEqual(
            expect.not.arrayContaining([
              expect.objectContaining({
                candidat: expect.objectContaining({
                  cvs: expect.arrayContaining([
                    expect.objectContaining({ status: 'Published' }),
                  ]),
                }),
              }),
            ])
          );
          expect(response.body).not.toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                candidat: expect.objectContaining({
                  coach: null,
                }),
              }),
            ])
          );
        });
      });
    });
    describe('U - Update 1 User', () => {
      describe('Update user - /:id', () => {
        it('Should return 401 if user is not logged in', async () => {
          const updates = await userFactory({}, {}, false);
          const response = await request(serverTest)
            .put(`${route}/${otherLoggedInCandidat.user.id}`)
            .send({
              phone: updates.phone,
              firstName: updates.firstName,
            });
          expect(response.status).toBe(401);
        });
        it('Should return 401 if user do not have the rights to update targeted user', async () => {
          const updates = await userFactory({}, {}, false);
          const response = await request(serverTest)
            .put(`${route}/${otherLoggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              phone: updates.phone,
              firstName: updates.firstName,
            });
          expect(response.status).toBe(401);
        });
        it('Should return 200 and updated user when a candiate update himself', async () => {
          const updates = await userFactory({}, {}, false);
          const response = await request(serverTest)
            .put(`${route}/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              phone: updates.phone,
              address: updates.phone,
            });
          expect(response.status).toBe(200);
          expect(response.body.phone).toEqual(updates.phone);
        });
        it('Should return 200 and updated user when coach update himself', async () => {
          const updates = await userFactory({}, {}, false);
          const response = await request(serverTest)
            .put(`${route}/${loggedInCoach.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({
              phone: updates.phone,
            });
          expect(response.status).toBe(200);
          expect(response.body.phone).toEqual(updates.phone);
        });
        it('Should return 401 when a not admin user updates his first name', async () => {
          const updates = await userFactory({}, {}, false);
          const response = await request(serverTest)
            .put(`${route}/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              firstName: updates.firstName,
            });
          expect(response.status).toBe(401);
        });
        it('Should return 401 when a not admin user updates his last name', async () => {
          const updates = await userFactory({}, {}, false);
          const response = await request(serverTest)
            .put(`${route}/${loggedInCoach.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({
              lastName: updates.lastName,
            });
          expect(response.status).toBe(401);
        });
        it('Should return 200 and updated user when an admin update a user', async () => {
          const updates = await userFactory({}, {}, false);
          const response = await request(serverTest)
            .put(`${route}/${otherLoggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({
              phone: updates.phone,
            });
          expect(response.status).toBe(200);
          expect(response.body.phone).toEqual(updates.phone);
        });
        it('Should return 200 and updated user when an admin update a user role', async () => {
          const response = await request(serverTest)
            .put(`${route}/${otherLoggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({
              role: USER_ROLES.COACH,
            });
          expect(response.status).toBe(200);
          expect(response.body.role).toEqual(USER_ROLES.COACH);
        });
      });
      describe('Update password - /change-pwd', () => {
        it('Should return 401 if invalid password', async () => {
          const response = await request(serverTest)
            .put(`${route}/change-pwd`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              email: loggedInCandidat.user.email,
              oldPassword: 'falsePassword',
              newPassword: 'CANDIDAT',
            });
          expect(response.status).toBe(401);
        });
        it('Should return 200 and updated user', async () => {
          const response = await request(serverTest)
            .put(`${route}/change-pwd`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              email: loggedInCandidat.user.email,
              oldPassword: 'candidat',
              newPassword: 'CANDIDAT',
            });
          expect(response.status).toBe(200);
        });
      });
      describe('/candidat/:id', () => {
        it('Should return 200, if candidat updates himself', async () => {
          const response = await request(serverTest)
            .put(`${route}/candidat/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              hidden: false,
              note: 'updated note by candidat',
            });
          expect(response.status).toBe(200);
        });
        it('Should return 200 and noteHasBeenModified, if coach checks if note has been updated', async () => {
          const response = await request(serverTest)
            .get(`${route}/candidat/checkUpdate`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(200);
          expect(response.body.noteHasBeenModified).toBe(true);
        });
        it('Should return 200 and noteHasBeenModified be false, if coach reads note', async () => {
          const setHasReadNoteRequest = await request(serverTest)
            .put(`${route}/candidat/read/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(setHasReadNoteRequest.status).toBe(200);

          const response = await request(serverTest)
            .get(`${route}/candidat/checkUpdate`)
            .set('authorization', `Token ${loggedInCoach.token}`);
          expect(response.status).toBe(200);
          expect(response.body.noteHasBeenModified).toBe(false);
        });
        it('Should return 200 and updated user_candidat, if coach updates candidate associated to him', async () => {
          const response = await request(serverTest)
            .put(`${route}/candidat/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({
              employed: false,
              note: 'updated note by coach',
            });
          expect(response.status).toBe(200);
        });
        it('Should return 200 and noteHasBeenModified, if candidat checks if note has been updated', async () => {
          const response = await request(serverTest)
            .get(`${route}/candidat/checkUpdate`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.noteHasBeenModified).toBe(true);
        });
        it('Should return 200 and noteHasBeenModified be false, if candidat reads note', async () => {
          const setHasReadNoteRequest = await request(serverTest)
            .put(`${route}/candidat/read/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(setHasReadNoteRequest.status).toBe(200);

          const response = await request(serverTest)
            .get(`${route}/candidat/checkUpdate`)
            .set('authorization', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(200);
          expect(response.body.noteHasBeenModified).toBe(false);
        });
        it('Should return 200 and updated user_candidat, if logged in admin', async () => {
          const response = await request(serverTest)
            .put(`${route}/candidat/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({
              employed: false,
              note: 'updated note by coach',
            });
          expect(response.status).toBe(200);
        });
        it("Should return 401, if candidat doesn't updates himself", async () => {
          const response = await request(serverTest)
            .put(`${route}/candidat/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${otherLoggedInCandidat.token}`)
            .send({
              employed: false,
              note: 'updated note by other',
            });
          expect(response.status).toBe(401);
        });
        it('Should return 401, if coach updates candidate not associated to him', async () => {
          const response = await request(serverTest)
            .put(`${route}/candidat/${otherLoggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({
              employed: false,
              note: 'updated note by not associated coach',
            });
          expect(response.status).toBe(401);
        });
      });
    });

    describe('D - Delete 1 User', () => {
      it('Should return 401 if not logged in admin', async () => {
        const response = await request(serverTest)
          .delete(`${route}/${otherLoggedInCandidat.user.id}`)
          .set('authorization', `Token ${loggedInCoach.token}`);
        expect(response.status).toBe(401);
      });
      it('Should return 200 if logged in as admin', async () => {
        const response = await request(serverTest)
          .delete(`${route}/${otherLoggedInCandidat.user.id}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
      });
      it('Should return 401 if try to get user after deletion', async () => {
        const response = await request(serverTest)
          .get(`${route}/${otherLoggedInCandidat.user.id}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(401);
      });
      it("Should return 401 if try to get user's CV after deletion", async () => {
        const response = await request(serverTest)
          .get(`${cvRoute}${otherLoggedInCandidat.user.id}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(404);
      });
    });
  });
});
