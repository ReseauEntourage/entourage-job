import userFactory from './factories/userFactory';

const {
  startTestServer,
  recreateTestDB,
  stopTestServer,
  createEntities,
} = require('./helpers/helpers');

const add = (a, b) => a + b;
describe('Dummy', async () => {
  test('Should add numbers', () => {
    const res = add(5, 5);
    expect(res).toBe(10);
  })
});

describe('User', async () => {
  beforeAll(async () => {
    console.log('USER BEFORE ALL');
    await startTestServer();
    await recreateTestDB();
    await userFactory().then((user) => console.log('USER FACTORY', user));
    // console.log('CREATE MANY USERS', createEntities(userFactory(), 5));
  });
  afterAll(async () => {
    stopTestServer();
  });
  describe('CRUD User', () => {
    test('Should not create a user without being logged.', () => {})
  });
});
