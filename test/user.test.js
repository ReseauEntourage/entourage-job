const request = require('supertest');
const userFactory = require('./factories/userFactory');
const {
  startTestServer,
  recreateTestDB,
  stopTestServer,
  resetTestDB,
  createLoggedInUser,
} = require('./helpers/helpers');
const {
  USER_ROLES
} = require('../constants');

let serverTest;
let loggedInAdmin;
let loggedInCoach;
let loggedInCandidat;
let knownCandidat;

describe('User', () => {
  beforeAll(async () => {
    await recreateTestDB();
    serverTest = await startTestServer();
    // await userFactory().then((user) => console.log('USER FACTORY', user));
    // await createEntities(userFactory(), {}, 5).then((user) => console.log('MANY MANY MANY', user));
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
          .post(`/api/v1/user`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(candidat);

        expect(response.status).toBe(200);
      });
      it('Should return 401 when the user is not logged-in.', async () => {
        const candidat = userFactory({
          role: USER_ROLES.CANDIDAT
        }, false);
        const response = await request(serverTest)
          .post(`/api/v1/user`)
          .send(candidat);
        expect(response.status).toBe(401);
      });
      it('Should return 401 when the user is not an administrator.', async () => {
        const candidat = await userFactory({
          role: USER_ROLES.CANDIDAT
        }, false);
        const response = await request(serverTest)
          .post(`/api/v1/user`)
          .set('authorization', `Token ${loggedInCandidat.token}`)
          .send(candidat);
        expect(response.status).toBe(401);
      });
      it('Should return 409 when the email already exist.', async () => {
        const candidat = await userFactory({
          role: USER_ROLES.CANDIDAT
        }, true);
        const response = await request(serverTest)
          .post(`/api/v1/user`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(candidat);
        expect(response.status).toBe(409);
      });
    });

    describe('R - Read 1 User', () => {
      it('Should return 401 when the user is not logged in.', async () => {
        const response = await request(serverTest)
          .get(`/api/v1/user/${knownCandidat.email}`);
        expect(response.status).toBe(401);
      });
      it('Should return 200 when logged-in candidat get himself', async () => {
        const response = await request(serverTest)
          .get(`/api/v1/user/${loggedInCandidat.user.email}`)
          .set('authorization', `Token ${loggedInCandidat.token}`);
        expect(response.status).toBe(200);
        expect(response.body.email).toEqual(loggedInCandidat.user.email);
      });
      it('Should return 200 when logged-in coach get himself', async () => {
        const response = await request(serverTest)
          .get(`/api/v1/user/${loggedInCoach.user.email}`)
          .set('authorization', `Token ${loggedInCoach.token}`);
        expect(response.status).toBe(200);
        expect(response.body.email).toEqual(loggedInCoach.user.email);
      });
      it('Should return 401 when logged-in coach get a candidat', async () => {
        const response = await request(serverTest)
          .get(`/api/v1/user/${knownCandidat.email}`)
          .set('authorization', `Token ${loggedInCoach.token}`);
        expect(response.status).toBe(401);
      })
      it('Should return 200 and get a user by email.', async () => {
        const response = await request(serverTest)
          .get(`/api/v1/user/${knownCandidat.email}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
        const receivedUser = response.body;
        expect(receivedUser.email).toEqual(knownCandidat.email);
        knownCandidat.id = receivedUser.id;
      });
      it('Should return 200 and get a user by id.', async () => {
        const response = await request(serverTest)
          .get(`/api/v1/user/${knownCandidat.id}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(knownCandidat.id);
      });
    });

    describe('U - Update 1 User', () => {

      describe('Update password', () => {
        it('Should return 401 if invalid password', async () => {
          const response = await request(serverTest)
            .put(`/api/v1/user/change-pwd`)
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
            .put(`/api/v1/user/change-pwd`)
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
            .put(`/api/v1/user/${knownCandidat.id}`)
            .send({
              phone: updates.phone,
              firstName: updates.firstName,
            });
          expect(response.status).toBe(401);
        });
        it('Should return 401 if user do not have the rights to update targeted user', async () => {
          const updates = await userFactory({}, false);
          const response = await request(serverTest)
            .put(`/api/v1/user/${knownCandidat.id}`)
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
            .put(`/api/v1/user/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              phone: updates.phone,
              firstName: updates.firstName,
            });
          expect(response.status).toBe(200);
          expect(response.body).toEqual({
            ...loggedInCandidat.user,
            phone: updates.phone,
            firstName: updates.firstName,
          });
        });
        it('Should return 200 and updated user when coach update himself', async () => {
          const updates = await userFactory({}, false);
          const response = await request(serverTest)
            .put(`/api/v1/user/${loggedInCoach.user.id}`)
            .set('authorization', `Token ${loggedInCoach.token}`)
            .send({
              phone: updates.phone,
            });
          expect(response.status).toBe(200);
        });
        it('Should return 200 and updated user when an admin update a user', async () => {
          const updates = await userFactory({}, false);
          const response = await request(serverTest)
            .put(`/api/v1/user/${knownCandidat.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              phone: updates.phone,
            });
          expect(response.status).toBe(200);
          expect(response.body.phone).toEqual(updates.phone);
        });
        it('Should return 200 and updated user when an admin update a user role', async () => {
          const updates = await userFactory({ role: USER_ROLES.COCaACH }, true);
          const response = await request(serverTest)
            .put(`/api/v1/user/${loggedInCandidat.user.id}`)
            .set('authorization', `Token ${loggedInCandidat.token}`)
            .send({
              phone: updates.phone,
              firstName: updates.firstName,
            });
          expect(response.status).toBe();
        });
      });
    });

    describe('D - Delete 1 User', () => {
      it('Should return 401 if not logged in admin', async () => {
        const response = await request(serverTest)
          .delete(`/api/v1/user/${knownCandidat.id}`)
          .set('authorisation', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
      });
      it('Should return 200', async () => {
        const response = await request(serverTest)
          .delete(`/api/v1/user/${knownCandidat.id}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
      });
    });
  });


});
