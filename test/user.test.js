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
      it('Should return the created user.', async () => {
        const candidat = await userFactory(
          { role: USER_ROLES.CANDIDAT },
          false
        );
        const response = await request(serverTest)
          .post(`/api/v1/user`)
          .set('authorization', `Token ${loggedInAdmin.token}`)
          .send(candidat);

        expect(response.status).toBe(200);
      });
      it('Should reutrn unauthorized if user is not logged in.', async () => {
        const candidat = userFactory({ role: USER_ROLES.CANDIDAT }, false);
        const response = await request(serverTest)
          .post(`/api/v1/user`)
          .send(candidat);
        expect(response.status).toBe(401);
      });
      it('Should return unauthorized if the user is not an administrator.', async () => {
        const candidat = await userFactory({ role: USER_ROLES.CANDIDAT }, false);
        const response = await request(serverTest)
          .post(`/api/v1/user`)
          .set('authorization', `Token ${loggedInCandidat.token}`)
          .send(candidat);
        expect(response.status).toBe(401);
      });
      // it('Should return conflict if email already exist.', async () => {
      //   const candidat = await userFactory({ role: USER_ROLES.CANDIDAT }, true);
      //   const response = await request(serverTest)
      //     .post(`/api/v1/user`)
      //     .set('authorization', `Token ${loggedInAdmin.token}`)
      //     .send(candidat);
      //   expect(response.status).toBe(409);
      // });
    });

    describe('R - Read 1 User', () => {
      it('Should return unauthorized if the user is not logged in.', async () => {
        const response = await request(serverTest)
          .get(`/api/v1/user/${knownCandidat.email}`);
        expect(response.status).toBe(401);
      });
      it('Should get a user by email.', async () => {
        console.log(':::::::: KNONWN USER :::::::::', knownCandidat.email);
        console.log(':::::::: logged in condidat', loggedInCandidat)
        const response = await request(serverTest)
          .get(`/api/v1/user/${knownCandidat.email}`)
          .set('authorization', `Token ${loggedInAdmin.token}`);
        expect(response.status).toBe(200);
        const receivedUser = response.body;
        knownCandidat.id = receivedUser.id;
        expect(receivedUser.id).toEqual(knownCandidat.id);
      });
      it('Should get a user by id.', async () => {
        console.log('F C:::::::', knownCandidat.id)
        const response = await request(serverTest)
          .get(`/api/v1/user/${knownCandidat.id}`)
          .set('authorization', `Token ${loggedInCandidat.token}`);
        expect(response.status).toBe(200);
        expect(JSON.parse(response.body).id).toMatchObject(knownCandidat.id);
      });
    });

    // describe.skip('R - Read Many User', () => {

    //   it('Should get all users', async () => {
    //     const response = await request(serverTest)
    //       .get(`/api/v1/user`);
    //   });
    // });

    // describe.skip('U - Update 1 User', () => {

    // });

    // describe.skip('D - Delete 1 User', () => {

    // });
  });


});
