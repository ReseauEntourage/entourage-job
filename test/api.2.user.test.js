import Api from '../Axios';

const { assert, expect } = require('chai');
const server = require('../backend/server');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const TIMEOUT = 20000;

const USER_EXAMPLE = {
  email: 'test.api.user@mail.fr',
  firstName: 'Test',
  lastName: 'Ament',
  password: 'azerty',
  salt: 'test',
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
      const userUpdated = USER_EXAMPLE;
      userUpdated.lastName = 'Updated';
      it('doit mettre à jour les données du User dans la base de données', () => {
        return Api.put(
          `${process.env.SERVER_URL}/api/v1/user/${user.id}`,
          userUpdated
        )
          .then((res) => {
            assert.equal(res.data, 1, 'Update du User effectué');
          })
          .catch((err) => assert.fail(`Update User échoué : ${err} `));
      }).timeout(TIMEOUT);
    });
    describe('D - Delete 1 User', () => {
      it('doit supprimer le User de test dans la base de données', () => {
        return Api.delete(`${process.env.SERVER_URL}/api/v1/user/${user.id}`)
          .then((res) => {
            assert.equal(res.data, 1, 'Delete du User effectué');
          })
          .catch((err) => assert.fail(`Delete du User échoué : ${err} `));
      }).timeout(TIMEOUT);
    });
  });

  describe('Routes User supplémentaires', () => {
    let user;
    before(() => {
      return Api.post(`${process.env.SERVER_URL}/api/v1/user`, USER_EXAMPLE)
        .then((res) => {
          user = res.data;
          assert.isObject(res.data, 'User retourné');
        })
        .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
    });

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
      it('doit retourner le User à partir de son adresse mail', () => {
        return Api.get(`${process.env.SERVER_URL}/api/v1/user/${user.email}`)
          .then((res) => {
            assert.isObject(res.data, 'User reçu');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(TIMEOUT);
    });

    describe('Modifier paramètre visibilité de son CV', () => {
      // A faire non connecté et connecté
      it('doit retourner 1 modification réussie', () => {
        return Api.put(
          `${process.env.SERVER_URL}/api/v1/user/candidat/${user.id}`,
          { hidden: false }
        )
          .then((res) => {
            expect(res.data)
              .to.be.an('array')
              .to.include(1);
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(TIMEOUT);

      it('doit retourner 1 modification ratée (utilisateur inexistant)', () => {
        return Api.put(
          `${process.env.SERVER_URL}/api/v1/user/candidat/1d1e1f`,
          { hidden: false }
        )
          .then((res) => assert.strictEqual(res.status, 400, 'Erreur attendue'))
          .catch((err) =>
            assert.strictEqual(err.response.status, 400, 'Erreur attendue')
          );
      }).timeout(TIMEOUT);
    });

    after(() => {
      return Api.delete(`${process.env.SERVER_URL}/api/v1/user/${user.id}`)
        .then((res) => {
          assert.equal(res.data, 1, 'Delete du User effectué');
        })
        .catch((err) => assert.fail(`Delete du User échoué : ${err} `));
    });

    describe('Changer son mot de passe', () => {
      let user;
      before((done) => {
        Api.post(`${process.env.SERVER_URL}/api/v1/user`, USER_EXAMPLE)
          .then(() =>
            Api.post(`${process.env.SERVER_URL}/api/v1/auth/login`, {
              email: USER_EXAMPLE.email,
              password: USER_EXAMPLE.password,
            })
          )
          .then(({ data }) => {
            console.log(data);
            user = { ...data.user, password: USER_EXAMPLE.password };
            done();
          });
      });

      after((done) => {
        Api.delete(
          `${process.env.SERVER_URL}/api/v1/user/${user.id}`
        ).then(() => done());
      });

      describe('User non connecté', () => {
        it("ne doit pas changer le mot de passe de l'utilisateur", () => {
          return Api.put(`${process.env.SERVER_URL}/api/v1/user/change-pwd`, {
            email: USER_EXAMPLE.email,
            oldPassword: 'azerty',
            newPassword: 'poiuytreza22',
          })
            .then(() => assert.fail())
            .catch((err) =>
              assert.strictEqual(err.response.status, 401, 'Erreur attendue')
            );
        }).timeout(TIMEOUT);
      });

      describe('User connecté', () => {
        it("doit changer le mot de passe de l'utilisateur", () => {
          return Api.put(
            `${process.env.SERVER_URL}/api/v1/user/change-pwd`,
            {
              email: USER_EXAMPLE.email,
              oldPassword: 'azerty',
              newPassword: 'poiuytreza22',
            },
            {
              headers: {
                authorization: `Token ${user.token}`,
              },
            }
          )
            .then((res) =>
              assert.strictEqual(res.status, 200, 'Mot de passe modifié')
            )
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        }).timeout(TIMEOUT);
      });
    });
  });
});
