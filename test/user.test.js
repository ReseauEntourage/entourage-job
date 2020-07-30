const request = require('supertest');
const userFactory = require('./factories/userFactory');
const {
  startTestServer,
  recreateTestDB,
  stopTestServer,
  resetTestDB,
  createLoggedInUser,
  createEntities,
} = require('./helpers/helpers');
const {
  USER_ROLES
} = require('../constants');
const cvFactory = require('./factories/cvFactory');

const route = '/api/v1/user';
let serverTest;
const fakeId = '9bc0065e-b889-4f05-97v8-73i45f49976a';
let loggedInAdmin;
let loggedInCoach;
let loggedInCandidat;
let knownCandidat;

describe('User', () => {
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
    knownCandidat = await userFactory({ role: USER_ROLES.CANDIDAT });
  });

  afterAll(async () => {
    await resetTestDB();
    await stopTestServer();
  });


  describe('CRUD User', () => {

    describe('C - Create 1 User', () => {
      it('Should return 200 and a created user.', async () => {
        const candidat = await userFactory({
          role: USER_ROLES.CANDIDAT
        },
          false
        );
        const response = await request(serverTest)
          .post(`${route}`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(candidat);
        expect(response.status).toBe(200);
      });
      it('Should return 400 when user data contain wrong data types', async () => {
        const wrongData = {
          ...await userFactory({}, false),
          firstName: 123,
        }
        const response = await request(serverTest)
          .post(`${route}`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(wrongData);
        expect(response.status).toBe(400);
      })
      it('Should return 401 when the user is not logged-in.', async () => {
        const candidat = userFactory({
          role: USER_ROLES.CANDIDAT
        }, false);
        const response = await request(serverTest)
          .post(`${route}`)
          .send(candidat);
        expect(response.status).toBe(401);
      });
      it('Should return 401 when the user is not an administrator.', async () => {
        const candidat = await userFactory({
          role: USER_ROLES.CANDIDAT
        }, false);
        const response = await request(serverTest)
          .post(`${route}`)
          .set('authorization', `Token ${loggedInCandidat.token}`)
          .send(candidat);
        expect(response.status).toBe(401);
      });
      it('Should return 409 when the email already exist.', async () => {
        const candidat = await userFactory({
          role: USER_ROLES.CANDIDAT
        }, true);
        const response = await request(serverTest)
          .post(`${route}`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(candidat);
        expect(response.status).toBe(409);
      });
    });

    describe('R - Read 1 User', () => {
      it('Should return 401 when the user is not logged in.', async () => {
        const response = await request(serverTest)
          .get(`${route}/${knownCandidat.email}`);
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
          .get(`${route}/${knownCandidat.email}`)
          .set('authorization', `Token ${loggedInCoach.token}`);
        expect(response.status).toBe(401);
      })
      it('Should return 200 and get a user by email.', async () => {
        const response = await request(serverTest)
          .get(`${route}/${knownCandidat.email}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
        const receivedUser = response.body;
        expect(receivedUser.email).toEqual(knownCandidat.email);
        knownCandidat.id = receivedUser.id;
      });
      it('Should return 200 and get a user by id.', async () => {
        const response = await request(serverTest)
          .get(`${route}/${knownCandidat.id}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(knownCandidat.id);
      });
      it('Should return 404 if user not found', async () => {
        const response = await request(serverTest)
          .get(`${route}/${fakeId}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(404);
      });
    });

    describe('U - Update 1 User', () => {

      describe('Update password', () => {
        it('Should return 401 if invalid password', async () => {
          const response = await request(serverTest)
            .put(`${route}/change-pwd`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              email: loggedInCandidat.user.email,
              oldPassword: 'falsePassword',
              newPassword: 'CANDIDAT',
            })
          expect(response.status).toBe(401);
        });
        it('Should return 2OO and updated user', async () => {
          const response = await request(serverTest)
            .put(`${route}/change-pwd`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              email: loggedInCandidat.user.email,
              oldPassword: 'candidat',
              newPassword: 'CANDIDAT',
            })
          expect(response.status).toBe(200);
        });
      });

      describe('Update user', () => {
        it('Should return 401 if user is not logged in', async () => {
          const updates = await userFactory({}, false);
          const response = await request(serverTest)
            .put(`${route}/${knownCandidat.id}`)
            .send({
              phone: updates.phone,
              firstName: updates.firstName,
            });
          expect(response.status).toBe(401);
        });
        it('Should return 401 if user do not have the rights to update targeted user', async () => {
          const updates = await userFactory({}, false);
          const response = await request(serverTest)
            .put(`${route}/${knownCandidat.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              phone: updates.phone,
              firstName: updates.firstName,
            });
          expect(response.status).toBe(401);
        })
        it('Should return 200 and updated user when a candiate update himself', async () => {
          const updates = await userFactory({}, false);
          const response = await request(serverTest)
            .put(`${route}/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              firstName: updates.firstName,
            });
          expect(response.status).toBe(200);
          expect(response.body.firstName).toEqual(updates.firstName);
        });
        it('Should return 200 and updated user when coach update himself', async () => {
          const updates = await userFactory({}, false);
          const response = await request(serverTest)
            .put(`${route}/${loggedInCoach.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({
              phone: updates.phone,
            });
          expect(response.status).toBe(200);
          expect(response.body.phone).toEqual(updates.phone);
        });
        it('Should return 200 and updated user when an admin update a user', async () => {
          const updates = await userFactory({}, false);
          const response = await request(serverTest)
            .put(`${route}/${knownCandidat.id}`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({
              phone: updates.phone,
            });
          expect(response.status).toBe(200);
          expect(response.body.phone).toEqual(updates.phone);
        });
        it('Should return 200 and updated user when an admin update a user role', async () => {
          const response = await request(serverTest)
            .put(`${route}/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInAdmin.token}`)
            .send({
              role: USER_ROLES.COACH,
            });
          expect(response.status).toBe(200);
          expect(response.body.role).toEqual(USER_ROLES.COACH);
        });
      });
    });

    describe('D - Delete 1 User', () => {
      it('Should return 401 if not logged in admin', async () => {
        const response = await request(serverTest)
          .delete(`${route}/${knownCandidat.id}`)
          .set('authorisation', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(401);
      });
      it('Should return 200', async () => {
        const response = await request(serverTest)
          .delete(`${route}/${knownCandidat.id}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Other Routes:', () => {
    describe(
      'Search - search a user where query string in email, first name or last name',
      () => {
        it('Should return 401 if user is not a logged in admin', async () => {
          const response = await request(serverTest)
            .get(`${route}/search?query=e&role=${USER_ROLES.CANDIDAT}`)
            .set('authorisation', `Token ${loggedInCandidat.token}`);
          expect(response.status).toBe(401);
        });
        it('Should return 200 and users', async () => {
          const response = await request(serverTest)
            .get(`${route}/search?query=e&role=${USER_ROLES.CANDIDAT}`)
            .set('authorisation', `Token ${loggedInAdmin.token}`)
            .send({
              ...loggedInAdmin.user
            });
          expect(response.status).toBe(200);
        });
      });
    describe('Candidat - get user associated to a candidate or coach', () => {
      it('Should return 401 if user is not  a logged in user', async () => {
        const response = await request(serverTest)
          .get(`${route}/candidat`)
          .send({
            candidatId: loggedInCandidat.user.id
          });
        expect(response.status).toBe(401);
      });
      it('Should return 200 and users, candidat searching for himself', async () => {
        const response = await request(serverTest)
          .get(`${route}/candidat`)
          .set('authorisation', `Token ${loggedInCandidat.token}`)
          .send({
            candidatId: loggedInCandidat.user.id
          });
        expect(response.status).toBe(200);
      });
      it('Should return 200 and users, coach searching for himself', async () => {
        const response = await request(serverTest)
          .get(`${route}/candidat`)
          .set('authorisation', `Token ${loggedInCoach.token}`)
          .send({
            coachId: loggedInCoach.user.id
          });
        expect(response.status).toBe(200);
      });
      it('Should return 200 and users, admin searching for any users', async () => {
        const response = await request(serverTest)
          .get(`${route}/candidat`)
          .set('authorisation', `Token ${loggedInAdmin.token}`)
          .send({
            candidatId: loggedInCoach.user.id,
          });
        expect(response.status).toBe(200);
      });
    });
    describe('Members - get paginated and sorted users', () => {
      it('Should return 401 if user is not a logged in admin', async () => {
        const cv = [];
        const users = await createEntities(createLoggedInUser, {}, 6)
        users.forEach((u) => {
          if (u.user.role === USER_ROLES.CANDIDAT) {
            cv.push(createEntities(cvFactory, { userId: u.user.id }, 1))
          }
        });
        console.log(cv)
        console.log('::::::::::: USERS ENTITIES :::::::::::::', users);
        const response = await request(serverTest)
          .get(`${route}/members`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(401);
      });
      it('Should return 200 and paginated users', async () => {
        const response = await request(serverTest)
          .get(`${route}/members?limit=2&offset=2`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
      });
    })
  });
});
