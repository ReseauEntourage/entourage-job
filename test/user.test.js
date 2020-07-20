const {
    startTestServer,
    recreateTestDB,
    stopTestServer,
} = require('./helpers/helpers');

const add = (a, b) => a + b;
describe('Dummy', async () => {
    beforeAll(async () => {
        console.log('BEFORE ALL')
    })
    it('Should add numbers', () => {
        const res = add(5, 5);
    })
});

describe('User', async () => (
    beforeAll(async () => {
        console.log('USER BEFORE ALL');
        startTestServer();
        recreateTestDB();
    });
afterAll(async () => {
    stopTestServer();
});
decsribe('CRUD User', () => {
    it('Should not create a user without being logged.', () => {

    })
})
))