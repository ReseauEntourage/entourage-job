import Api from '../Axios';

const { assert } = require('chai');
const server = require('../backend/server');
const AuthController = require('../backend/controllers/Auth');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const TIMEOUT = 20000;

describe('Auth', () => {
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
    const USER_EXAMPLE = {
      email: 'test.ament@cesttropsuper.com',
      firstName: 'Test',
      lastName: 'Ament',
      role: null,
      isAdmin: true,
      password: 'azertyuiop',
    };

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
            assert.isObject(res.data.user, 'User retourné');
            assert.hasAnyKeys(res.data.user, 'token', 'contient un token');
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
});
