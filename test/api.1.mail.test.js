import Api from '../Axios';

const { assert } = require('chai');
const server = require('../backend/server');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const TIMEOUT = 20000;

describe.skip('Mail', () => {
  before(() => {
    server.prepare();
    return server.start(PORT);
  });

  after((done) => {
    server.close();
    done();
  });

  it("doit effectuer l'envoi de mail \"Contactez-nous\"", () => {
    return Api.post(`/api/v1/mail/contact-us`, {
      email: 'myemail@myemail.email',
      message: 'mon text de blablabla test',
    })
      .then((res) => {
        assert.isObject(res, 'pas de res');
      })
      .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
  }).timeout(TIMEOUT);
});
