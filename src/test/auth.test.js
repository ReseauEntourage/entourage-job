import { USER_ROLES } from 'src/constants';
import userFactory from 'src/test/factories/userFactory';

import request from 'supertest';

import {
  createLoggedInUser,
  getResetLinkAndUser,
  recreateTestDB,
  resetTestDB,
  startTestServer,
  stopTestServer,
} from 'src/test/helpers';

describe('Auth', () => {
  const route = '/api/v1/auth';
  let serverTest;
  let candidat;
  let candidatResponse;
  let loggedInCandidat;
  let unknownUser;
  const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxheW5lX2JhaHJpbmdlckBob3RtYWlsLmNvbSIsImlkIjoiMWM0NzI0MzEtZTg4NS00MGVhLWI0MWEtMjA1M2RlODJhZDJlIiwiZmlyc3ROYW1lIjoiT2N0YXZpYSIsImxhc3ROYW1lIjoiWXVuZHQiLCJwaG9uZSI6IjI2Mi0wMzItOTY2NCB4NzY5NCIsImdlbmRlciI6MCwicm9sZSI6IkNhbmRpZGF0IiwiZXhwIjoxNjAzNDM3OTE4LCJjYW5kaWRhdElkIjpudWxsLCJjb2FjaElkIjpudWxsLCJpYXQiOjE1OTgyNTM5MTh9.TrUmF20O7TJR2NwqjyyJJvEoBjs59Q3ClqX6PEHUsOw';

  beforeAll(async () => {
    serverTest = await startTestServer();
    await recreateTestDB();
    unknownUser = await userFactory(
      {
        role: USER_ROLES,
        password: 'unknownUser',
      },
      {},
      false
    );
    loggedInCandidat = await createLoggedInUser({
      role: USER_ROLES.CANDIDAT,
      password: 'loggedInCandidat',
    });
  });
  beforeEach(async () => {
    candidat = await userFactory({
      role: USER_ROLES.CANDIDAT,
      password: 'candidat',
    });
    candidatResponse = {
      ...candidat,
    };
    delete candidatResponse.createdAt;
    delete candidatResponse.hashReset;
    delete candidatResponse.lastConnection;
    delete candidatResponse.password;
    delete candidatResponse.salt;
    delete candidatResponse.saltReset;
    delete candidatResponse.updatedAt;
    delete candidatResponse.deletedAt;
    delete candidatResponse.revision;
  });
  afterAll(async () => {
    await resetTestDB();
    await stopTestServer();
  });
  describe('Login - login/', () => {
    it("Should return 200 and user's info with token, if valid email and password", async () => {
      const response = await request(serverTest).post(`${route}/login`).send({
        email: candidat.email,
        password: 'candidat',
      });
      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject(candidatResponse);
      expect(response.body.user.token).toBeTruthy();
    });
    it('Should return 400, if invalid email', async () => {
      const response = await request(serverTest).post(`${route}/login`).send({
        email: 'invalidEmail',
        password: 'candidat',
      });
      expect(response.status).toBe(400);
    });
    it('Should return 400, if invalid password', async () => {
      const response = await request(serverTest).post(`${route}/login`).send({
        email: candidat.email,
        password: 'invalidPassword',
      });
      expect(response.status).toBe(400);
    });
    it('Should return 422, if no email', async () => {
      const response = await request(serverTest).post(`${route}/login`).send({
        password: 'candidat',
      });
      expect(response.status).toBe(422);
    });
    it('Should return 422, if no password', async () => {
      const response = await request(serverTest).post(`${route}/login`).send({
        email: candidat.email,
      });
      expect(response.status).toBe(422);
    });
  });
  describe.skip('Logout - logout/', () => {
    // TODO: Rediretion or logout?
    it(`Should logout the user`, async () => {
      await request(serverTest)
        .post(`${route}/logout`)
        .set('authorization', `Token ${loggedInCandidat.token}`);

      const response = await request(serverTest)
        .get(`/api/v1/user/candidat`)
        .set('authorization', `Token ${loggedInCandidat.token}`)
        .query({
          candidatId: loggedInCandidat.user.id,
        });
      expect(response.status).toBe(401);
    });
  });
  describe('Forgot - forgot/', () => {
    it('Should return 422; if no user email provided', async () => {
      const response = await request(serverTest).post(`${route}/forgot`);
      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        errors: {
          email: 'is required',
        },
      });
    });
    it('Should return 404; if invalid user email provided', async () => {
      const response = await request(serverTest).post(`${route}/forgot`).send({
        email: 'invalid@nowhere.nothing',
      });
      expect(response.status).toBe(404);
    });
    it('Should return 200 and send email, if valid user email provided', async () => {
      const response = await request(serverTest).post(`${route}/forgot`).send({
        email: candidat.email,
      });
      expect(response.status).toBe(200);
    });
  });
  describe('reset - reset/:userId/:token', () => {
    describe("Verify password's reset link", () => {
      it('Should return 200, if valid link', async () => {
        const reset = await getResetLinkAndUser(loggedInCandidat.user);
        const response = await request(serverTest).get(
          `${route}/${reset.link}`
        );
        expect(response.status).toBe(200);
      });
      it('Should return 403, if invalid id in link', async () => {
        const reset = await getResetLinkAndUser(loggedInCandidat.user);
        const response = await request(serverTest).get(
          `${route}/reset/${unknownUser.id}/${reset.token}`
        );
        expect(response.status).toBe(403);
      });
      it('Should return 403, if invalid id in link', async () => {
        const reset = await getResetLinkAndUser(loggedInCandidat.user);
        const response = await request(serverTest).get(
          `${route}/reset/${reset.updatedUser.id}/${invalidToken}`
        );
        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Lien non valide');
      });
    });
    describe('Reset password', () => {
      it('Should return 200 and updated user, if valid link', async () => {
        const reset = await getResetLinkAndUser(loggedInCandidat.user);
        const response = await request(serverTest)
          .post(`${route}/${reset.link}`)
          .send({
            newPassword: 'newPassword',
            confirmPassword: 'newPassword',
          });
        expect(response.status).toBe(200);
        console.log('RESPONSE', response.body);
        expect(response.body.id).toBe(loggedInCandidat.user.id);
      });
      it('Should return 400, if not matching passwords', async () => {
        const reset = await getResetLinkAndUser(loggedInCandidat.user);
        const response = await request(serverTest)
          .post(`${route}/${reset.link}`)
          .send({
            newPassword: 'newPassword',
            confirmPassword: 'Password',
          });

        expect(response.status).toBe(400);
      });
      it('Should return 403, if invalid user id', async () => {
        const reset = await getResetLinkAndUser(loggedInCandidat.user);
        const response = await request(serverTest)
          .post(`${route}/reset/${unknownUser.id}/${reset.token}`)
          .send({
            newPassword: 'newPassword',
            confirmPassword: 'newPassword',
          });
        console.log(response.status);
        expect(response.status).toBe(403);
      });
      it('Should return 403 if invalid user token', async () => {
        const reset = await getResetLinkAndUser(loggedInCandidat.user);
        const response = await request(serverTest)
          .post(`${route}/reset/${reset.updatedUser.id}/${invalidToken}`)
          .send({
            newPassword: 'newPassword',
            confirmPassword: 'newPassword',
          });
        expect(response.status).toBe(403);
      });
    });
  });
  describe('Current - /current', () => {
    it('Should return a user with token if valid token provided', async () => {
      const response = await request(serverTest)
        .get(`${route}/current`)
        .set('authorization', `Token ${loggedInCandidat.token}`);
      expect(response.status).toBe(200);
      expect(response.body.user.token).toBeTruthy();
      expect(response.body.user.id).toBe(loggedInCandidat.user.id);
    });
    it('Should return 401, if invalid token', async () => {
      console.log(loggedInCandidat.user.id);
      const response = await request(serverTest)
        .get(`${route}/current`)
        .set('authorization', `Token ${invalidToken}`);
      console.log(response.body.user);
      expect(response.status).toBe(401);
    });
  });
});
