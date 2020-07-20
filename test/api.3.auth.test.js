import Api from '../Axios';

const { assert } = require('chai');
const server = require('../backend/server');
const AuthController = require('../backend/controllers/Auth');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const TIMEOUT = 20000;

describe.skip('Tests des routes API - Partie Authentification', () => {
  describe('#Controller', () => {
    const password = 'azertyuiop';
    it('should create a salt and a hash password', () => {
      const { salt, hash } = AuthController.encryptPassword(password);
      assert.isString(salt, "le salt n'est pas une chaine de caracteres");
      assert.isString(hash, "le hash n'est pas une chaine de caracteres");
    });

    describe('#password validation', () => {
      let hash;
      let salt;
      before(() => {
        const encrypt = AuthController.encryptPassword(password);
        salt = encrypt.salt;
        hash = encrypt.hash;
      });

      it('should validate password', () => {
        assert.isTrue(
          AuthController.validatePassword(password, hash, salt),
          'le mot de passe devrait etre valide'
        );
      });

      it('should not validate password', () => {
        assert.isFalse(
          AuthController.validatePassword('poiuytreza', hash, salt),
          'le mot de passe devrait etre invalide'
        );
      });
    });
  });

  describe('#Routes', () => {
    let user;
    const USER_EXAMPLE = {
      email: 'test.api.auth@mail.fr',
      firstName: 'Test',
      lastName: 'Ament',
      role: null,
      isAdmin: true,
      password: 'azerty',
    };

    before((done) => {
      server.prepare();
      server
        .start(PORT)
        .then(() => {
          return Api.post(
            `${process.env.SERVER_URL}/api/v1/user`,
            USER_EXAMPLE
          );
        })
        .then((res) => {
          user = res.data;
          done();
        });
    });

    after((done) => {
      Api.delete(`${process.env.SERVER_URL}/api/v1/user/${user.id}`)
        .then(() => server.close())
        .then(() => done());
    });

    describe('#login', () => {
      it("doit connecter l'utilisateur en lui renvoyant un token", () => {
        return Api.post(`${process.env.SERVER_URL}/api/v1/auth/login`, {
          email: USER_EXAMPLE.email,
          password: USER_EXAMPLE.password,
        })
          .then((res) => {
            assert.isObject(res.data.user, 'User retourné');
            assert.hasAnyKeys(res.data.user, 'token', 'contient un token');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      });
    }).timeout(TIMEOUT);

    describe('Réinitialisation de son mot de passe', () => {
      describe('Route POST /api/v1/auth/forgot', () => {
        it('doit retourner un code retour 200 avec une adresse mail connue', () => {
          return Api.post(`${process.env.SERVER_URL}/api/v1/auth/forgot`, {
            email: USER_EXAMPLE.email,
          })
            .then((res) => {
              assert.strictEqual(
                res.status,
                200,
                'Un mail a normalement été envoyé'
              );
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        });

        it('doit retourner un code retour 200 avec une adresse mail inconnue', () => {
          return Api.post(`${process.env.SERVER_URL}/api/v1/auth/forgot`, {
            email: 'inconnu-test@cesttropsuper.com',
          })
            .then((res) => {
              assert.strictEqual(
                res.status,
                200,
                'Un mail a normalement été envoyé'
              );
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        });

        it('doit retourner un code retour 422 avec une adresse mail vide', () => {
          return Api.post(`${process.env.SERVER_URL}/api/v1/auth/forgot`, {
            email: '',
          })
            .then((res) => {
              assert.strictEqual(res.status, 422, "L'adresse était bien vide");
            })
            .catch((err) =>
              assert.strictEqual(
                err.response.status,
                422,
                "L'adresse était bien vide"
              )
            );
        });
      });

      describe('Route GET /api/v1/auth/reset/:id/:token', () => {
        it('doit retourner un code retour 403 (ici token invalide)', () => {
          return Api.get(
            `${process.env.SERVER_URL}/api/v1/auth/reset/${user.id}/faux`
          )
            .then((res) =>
              assert.strictEqual(
                res.status,
                403,
                "Le lien reçu n'est pas valide"
              )
            )
            .catch((err) =>
              assert.strictEqual(
                err.response.status,
                403,
                "Le lien reçu n'est pas valide"
              )
            );
        });

        it('doit retourner un code retour 403 (ici id invalide)', () => {
          return Api.get(
            `${process.env.SERVER_URL}/api/v1/auth/reset/faux/${user.token}`
          )
            .then((res) =>
              assert.strictEqual(
                res.status,
                401,
                "Le lien reçu n'est pas valide (id non conforme)"
              )
            )
            .catch((err) =>
              assert.strictEqual(
                err.response.status,
                401,
                "Le lien reçu n'est pas valide (id non conforme)"
              )
            );
        });

        it.skip('doit retourner un code retour 200 (id et token valide)', () => {
          return Api.get(
            `${process.env.SERVER_URL}/api/v1/auth/reset/${user.id}/${user.token}`
          )
            .then((res) => {
              assert.strictEqual(res.status, 200, 'Le lien reçu est valide');
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        });
      });

      describe('Route POST /api/v1/auth/reset/:id/:token', () => {
        it('doit retourner un code retour 403 (ici token invalide)', () => {
          return Api.post(
            `${process.env.SERVER_URL}/api/v1/auth/reset/${user.id}/faux`,
            { newPassword: 'qwerty', confirmPassword: 'qwerty' }
          )
            .then((res) =>
              assert.strictEqual(
                res.status,
                403,
                "Le lien reçu n'est pas valide"
              )
            )
            .catch((err) =>
              assert.strictEqual(
                err.response.status,
                403,
                "Le lien reçu n'est pas valide"
              )
            );
        });

        it('doit retourner un code retour 403 (ici id invalide)', () => {
          return Api.post(
            `${process.env.SERVER_URL}/api/v1/auth/reset/faux/${user.token}`,
            { newPassword: 'qwerty', confirmPassword: 'qwerty' }
          )
            .then((res) =>
              assert.strictEqual(
                res.status,
                401,
                "Le lien reçu n'est pas valide (id non conforme)"
              )
            )
            .catch((err) =>
              assert.strictEqual(
                err.response.status,
                401,
                "Le lien reçu n'est pas valide (id non conforme)"
              )
            );
        });

        it.skip('doit retourner un code retour 400 (id et token valide mais mauvais contenu envoyé)', () => {
          return Api.post(
            `${process.env.SERVER_URL}/api/v1/auth/reset/${user.id}/${user.token}`,
            { newPassword: 'qwerty', confirmPassword: 'azerty' }
          )
            .then((res) =>
              assert.strictEqual(
                res.status,
                400,
                "Le contenu envoyé n'est pas correct"
              )
            )
            .catch((err) =>
              assert.strictEqual(
                err.response.status,
                400,
                "Le contenu envoyé n'est pas correct"
              )
            );
        });

        it.skip('doit retourner un code retour 200 (id et token valide)', () => {
          return Api.post(
            `${process.env.SERVER_URL}/api/v1/auth/reset/${user.id}/${user.token}`,
            { newPassword: 'qwerty', confirmPassword: 'qwerty' }
          )
            .then((res) => {
              assert.strictEqual(
                res.status,
                200,
                'Nouveau mot de passe enregistré'
              );
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        });
      });
    });

    describe('#logout', () => {
      before((done) => {
        Api.post(`${process.env.SERVER_URL}/api/v1/auth/login`, {
          email: USER_EXAMPLE.email,
          password: USER_EXAMPLE.password,
        }).then(({ data }) => {
          user = { ...data.user, password: USER_EXAMPLE.password };
          done();
        });
      });

      it('doit retourner un code retour 404', () => {
        return Api.post(
          `${process.env.SERVER_URL}/api/v1/auth/logout`,
          {
            email: USER_EXAMPLE.email,
          },
          {
            headers: {
              authorization: `Token ${user.token}`,
            },
          }
        )
          .then((res) => {
            assert.strictEqual(res.status, 404, 'Page non trouvée attendue');
          })
          .catch((err) =>
            assert.strictEqual(
              err.response.status,
              404,
              'Page non trouvée attendue'
            )
          );
      });
    }).timeout(TIMEOUT);
  });
});
