import Api from '../Axios';

const { assert } = require('chai');
const server = require('../backend/server');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const TIMEOUT = 20000;

const USER_EXAMPLE = {
  email: 'test.ament@cesttropsuper.com',
  firstName: 'Test',
  lastName: 'Ament',
  role: null,
  // azertyuiop
  password:
    '7ccdfc608900add67d2d80ee1d1d21c3c753b41e669194e647d577edc56edbfd693c3021604af7b822dc30f26f288003ee3e49d462c4d811724188edd479c6af4c975deb74e5a42679cd80ac2cb9459a40c20e45b4d59334bad12b1146f2eff399cf67901deb807bcd3d24244ac3b7cb6fcd7a1cd752d4a69125214566022fd2051333baf70a34bb923f621a55d98a25092a170fad4a9e4a22f945a3aff4c0514063748792b03dadb6c9668ff3470fe746897e8a8aa2315126e9bada15489666bc01f02d297469653641557009b4a06435f31e539133dfe055bdf562379bff4aee88e09c85a11ce7cfb953ed632c1c1f46f6fa1285267bd29dc1202a9cc64c6a832e36c3680b506458cb50ac634c6d8fb36d9b818f74632c8e0263a88b34c465c945b83661d1c58ad6b732ef1b883d96835168d85bd68c424627dae1d25cdd896a13dc7af461705fc5e9a5d7bed7f24cd7176f7e41b3dbf1d75a8f4d6ece47e8facd9d840d2578bdd75c7c55f3a75ab40b5aa38afd754d353a7a76571baf8807c1a27cfc05a6debbb7aa31551e88d20208d58a4b01752ba50a7e413fbbf20fb7aefb591a8db1d425b12ffae6158f3a4b318aa980699dcbba1d17db0fb0c6b6ddc55de918ce3e50f51c84780ab01c064c2820219c8be66d25d488750c5554eba8e0dc0970af588f2778ed2cf10ad7434dfb42398c475c7882ecfd61410ff3a02b',
  salt: '172431da17f2e96722c19e9a7b65ae4e',
};

describe('Auth', () => {
  before(() => {
    server.prepare();
    return server.start(PORT);
  });

  after((done) => {
    server.close();
    done();
  });

  describe('#login', () => {
    let user;
    before(() => {
      return Api.post(`${process.env.SERVER_URL}/api/v1/user`, USER_EXAMPLE)
        .then((res) => {
          user = res.data;
        })
        .catch(() => {
          throw new Error("Erreur lors de la creation de l'utilisateur");
        });
    });

    after(() => {
      return Api.delete(`${process.env.SERVER_URL}/api/v1/user/${user.id}`)
        .then(() => {})
        .catch(() => {
          throw new Error("Erreur lors de la suppression de l'utilisateur");
        });
    });

    it("doit connecter l'utilisateur en lui renvoyant un token", () => {
      return Api.post(`${process.env.SERVER_URL}/auth/login`, {
        email: USER_EXAMPLE.email,
        password: 'azertyuiop',
      })
        .then((res) => {
          assert.isObject(res.data, 'User retourné');
          assert.hasAnyKeys(res.data, 'token', 'contient un token');
        })
        .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
    });
  }).timeout(TIMEOUT);

  it.skip("doit changer le mot de passe de l'utilisateur", () => {
    return Api.post(`${process.env.SERVER_URL}/auth/changepassword`, {
      email: USER_EXAMPLE.email,
      password: 'azertyuiop',
      newPassword: 'poiuytreza',
    })
      .then((res) => {})
      .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
  }).timeout(TIMEOUT);
});
