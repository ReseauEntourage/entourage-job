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
  password: 'azerty',
};

describe('Tests des routes API - Partie User', () => {
  before((done) => {
    server.prepare();
    server.start(PORT).then(done);
  });

  after(() => {
    server.close();
  });

  describe('CRUD User', () => {
    let user;

    describe('C - Create 1 User', () => {
      it('doit créer un utilisateur dans la base de données', () => {
        return Api.post(`${process.env.SERVER_URL}/api/v1/user`, USER_EXAMPLE)
          .then((res) => {
            user = res.data;
            assert.isObject(res.data, 'User retourné');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(TIMEOUT);
    });
    describe('R - Read 1 User', () => {
      it("doit retourner le User créé précédement à l'appel API", () => {
        return Api.get(`${process.env.SERVER_URL}/api/v1/user/${user.id}`)
          .then((res) => {
            assert.isObject(res.data, 'User reçu');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(TIMEOUT);
    });
    describe('U - Update 1 User', () => {
      it('doit mettre à jour les données du User dans la base de données', () => {
        return Api.delete(`${process.env.SERVER_URL}/api/v1/user/${user.id}`)
          .then((res) => {
            assert.equal(res.data, 1, 'Update du User effectué');
          })
          .catch((err) => assert.fail(`Update User échoué : ${err} `));
      }).timeout(TIMEOUT);
    });
    describe('D - Delete 1 CV', () => {
      it('doit supprimer le User de test dans la base de données', () => {
        return Api.delete(`${process.env.SERVER_URL}/api/v1/user/${user.id}`)
          .then((res) => {
            assert.equal(res.data, 1, 'Delete du User effectué');
          })
          .catch((err) => assert.fail(`Delete du User échoué : ${err} `));
      }).timeout(TIMEOUT);
    });
  });

  describe('Routes CV supplémentaires', () => {
    describe('Récupérer tous les Users', () => {
      it("doit retourner un tableau de Users à l'appel API", () => {
        return Api.get(`${process.env.SERVER_URL}/api/v1/user`)
          .then((res) => {
            assert.isArray(res.data, 'Tableau reçu');
          })
          .catch((err) =>
            assert.fail(`Récupération des Users échoué : ${err} `)
          );
      }).timeout(TIMEOUT);
    });

    describe('Récupérer 1 User à partir de son email', () => {
      let user;
      before(() => {
        return Api.post(`${process.env.SERVER_URL}/api/v1/user`, USER_EXAMPLE)
          .then((res) => {
            user = res.data;
            assert.isObject(res.data, 'User retourné');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      });
      it('doit retourner le User créé précédement à partir de son email', () => {
        return Api.get(`${process.env.SERVER_URL}/api/v1/user/${user.email}`)
          .then((res) => {
            assert.isObject(res.data, 'User reçu');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(TIMEOUT);
      after(() => {
        return Api.delete(`${process.env.SERVER_URL}/api/v1/user/${user.id}`)
          .then((res) => {
            assert.equal(res.data, 1, 'Delete du User effectué');
          })
          .catch((err) => assert.fail(`Delete du User échoué : ${err} `));
      });
    });
  });
});
