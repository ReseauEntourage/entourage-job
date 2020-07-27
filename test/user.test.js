const request = require('supertest');
const userFactory = require('./factories/userFactory');
const {
  startTestServer,
  recreateTestDB,
  stopTestServer,
  resetTestDB,
  getLoggedInUser,
} = require('./helpers/helpers');
const {
  USER_ROLES
} = require('../constants');

let serverTest;
let loggedInAdmin;
let loggedInUser;

describe('User', () => {
  beforeAll(async () => {
    await recreateTestDB();
    serverTest = await startTestServer();
    // await userFactory().then((user) => console.log('USER FACTORY', user));
    // await createEntities(userFactory(), {}, 5).then((user) => console.log('MANY MANY MANY', user));
    // loggedInAdmin = await getLoggedInUser({
    //   role: USER_ROLES.ADMIN,
    //   password: 'admin',
    // });
    // loggedInUser = await getLoggedInUser({
    //   role: USER_ROLES.CANDIDAT,
    //   password: 'candidat',
    // });
  });

  afterAll(async () => {
    await stopTestServer();
    await resetTestDB();
  });

  describe('C - Create 1 User', () => {
    it('Should return the created user.', async () => {
      loggedInAdmin = await getLoggedInUser({
        role: USER_ROLES.ADMIN,
        password: 'admin',
      });

      const candidat = await userFactory({
        role: USER_ROLES.CANDIDAT
      }, false);
      const response = await request(serverTest)
        .post(`/api/v1/user`)
        .set('authorization', `Token ${loggedInAdmin.token}`)
        .send(candidat);
      expect(response.status).toBe(200);
    });
    // it('Should reutrn unauthorized if user is not logged in.', async () => {
    //   const candidat = userFactory({ role: USER_ROLES.CANDIDAT }, false);
    //   const response = await request(serverTest)
    //     .post(`/api/v1/user`)
    //     .send(candidat);
    //   expect(response.status).toBe(401);
    // });
    // it('Should return unauthorized if the user is not an administrator.', async () => {
    //   const candidat = await userFactory({ role: USER_ROLES.CANDIDAT }, false);
    //   const response = await request(serverTest)
    //     .post(`/api/v1/user`)
    //     .set('authorization', `Token ${loggedInUser.token}`)
    //     .send(candidat);
    //   expect(response.status).toBe(401);
    // });
    // it('Should return conflict if email already exist.', async () => {
    //   const candidat = await userFactory({ role: USER_ROLES.CANDIDAT }, true);
    //   const response = await request(serverTest)
    //     .post(`/api/v1/user`)
    //     .set('authorization', `Token ${loggedInAdmin.token}`)
    //     .send(candidat);
    //   expect(response.status).toBe(409);
    // });
  });

  // describe('CRUD User', () => {
  //
  //   describe.skip('R - Read 1 User', () => {
  //     const user = userFactory({ role: USER_ROLES.CANDIDAT });
  //     it('Should return unauthorized if the user is not logged in.', async () => {
  //       const response = await request(serverTest)
  //         .get(`/api/v1/user`);
  //       expect(response.status).toBe(401);
  //     });
  //     it('Should get a user by email.', async () => {
  //       const response = await request(serverTest)
  //         .get(`/api/v1/user/${user.email}`)
  //         .set('athorization', `Token ${loggedInUser.token}`);
  //       expect(response).toBe(200);
  //       expect(response.body.data).objectContaining(user);
  //     });
  //     it('should get a user by id.', async () => {
  //       const userDB = await request(serverTest)
  //         .get(`/api/v1/user/${user.email}`)
  //         .set('athorization', `Token ${loggedInUser.token}`);
  //       const response = await request(serverTest)
  //         .get(`/api/v1/user/${userDB.id}`)
  //         .set('athorization', `Token ${loggedInUser.token}`);
  //       expect(response.body.data).objectContaining(user);
  //     });
  //   });
  //
  //   describe.skip('R - Read Many User', () => {
  //
  //     it('Should get all users', async () => {
  //       const response = await request(serverTest)
  //         .get(`/api/v1/user`);
  //     });
  //   });
  //
  //   describe.skip('U - Update 1 User', () => {
  //
  //   });
  //
  //   describe.skip('D - Delete 1 User', () => {
  //
  //   });
  // });


});
