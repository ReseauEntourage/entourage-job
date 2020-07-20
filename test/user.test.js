const {
    startTestServer,
    recreateTestDB,
    stopTestServer,
} = require('./helpers/helpers');
const userFactory = require('./factories/userTestFactory')

const add = (a, b) => a + b;
describe('Dummy', async () => {
    it('Should add numbers', () => {
        const res = add(5, 5);
        expect(res).toBe(10);
    })
});

describe('User', async () => {
    beforeAll(async () => {
        console.log('USER BEFORE ALL');
        startTestServer();
        recreateTestDB();
        console.log('USER FACTORY', userFactory());
    });
    afterAll(async () => {
        stopTestServer();
    });
    describe('CRUD User', () => {
        it('Should not create a user without being logged.', () => {
        })
    });
});
