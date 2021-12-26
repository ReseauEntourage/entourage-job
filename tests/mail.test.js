import {
  recreateTestDB,
  resetTestDB,
  startTestServer,
  stopTestServer,
} from 'tests/helpers';

import request from 'supertest';
import faker from 'faker';

describe('Mail', () => {
  const route = '/api/v1/mail';
  let serverTest;
  let data;

  beforeAll(async () => {
    serverTest = await startTestServer();
    await recreateTestDB();
    data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      structure: faker.company.companyName(2),
      message: faker.lorem.paragraphs(3, '\n'),
      heardAbout: faker.lorem.paragraphs(1),
    };
  });
  afterAll(async () => {
    await resetTestDB();
    await stopTestServer();
  });
  it('Should return 200, if all content provided', async () => {
    const response = await request(serverTest)
      .post(`${route}/contact-us`)
      .send(data);
    expect(response.status).toBe(200);
  });
  it('Should return 200, if phone and structure not provided', async () => {
    const shortData = { ...data };
    delete shortData.structure;
    delete shortData.phone;
    const response = await request(serverTest)
      .post(`${route}/contact-us`)
      .send(shortData);
    expect(response.status).toBe(200);
  });
  it('Should return 500, if no data provided', async () => {
    const response = await request(serverTest)
      .post(`${route}/contact-us`)
      .send({});
    expect(response.status).toBe(500);
  });
});
