import Api from '../Axios';

const { assert } = require('chai');
const server = require('../backend/server');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const TIMEOUT = 20000;

const CV_EXAMPLE = {
  // url: 'Test-Ament',
  UserId: '27272727-aaaa-bbbb-cccc-012345678927',
  intro: 'Je suis une intro',
  location: 'Paris et Proche Banlieue',
  story:
    "Je suis une histoire qui peut être longue car d'expliquer mon parcours jusqu'à aujourd'hui. Je mets des mots au hasard car ce test n'a pas d'histoire. Je pourrais également ne mettre que des \"blablabla\"...   blablabla blabla blablabla bla blabla... voilà c'est assez long",
  transport: 'Fibre optique / Cuivre',
  availability: '24h/24 - 7j/7',
  contracts: ['CDI', 'CDD', 'Intérim'],
  experiences: [
    {
      skills: ['Rapide'],
      description: 'Chez Joyau, Espagne',
    },
    {
      description:
        'Société PFI à Lognes (77). (Fabrication de pièces automobiles, contrôle de qualité, mise des pièces en bac et étiquetage, fiches clients)',
    },
    {
      skills: ['Rapide', 'Fiable', 'Minutieux'],
      description:
        'Monteur Raccordeur en FTTH \nHOBO (Electricité Haute et Basse tension)',
    },
    {
      skills: ['Rapide', 'Fiable'],
      description:
        'Dans le domaine informatique. Démantèlement des ordinateurs, effacement des données, installation de systèmes, changement de disques durs et mémoire, réparation',
    },
  ],
  languages: ['Javascript', 'TypeScript', 'HTML'],
  passions: ['Mocha', 'Travis CI', 'Poney aquatique'],
  ambitions: ["L'informatique", 'La fibre optique'],
  skills: ['Rapide', 'Fiable', 'Minutieux'],
};

const USER_EXAMPLE = {
  email: 'test.api.cv@mail.fr',
  firstName: 'Luigi',
  lastName: 'Mario',
  password: 'azerty',
};

describe('Tests des routes API - Partie CV', () => {
  let user;

  before((done) => {
    server.prepare();
    server
      .start(PORT)
      .then(() => {
        return Api.post(`${process.env.SERVER_URL}/api/v1/user`, USER_EXAMPLE);
      })
      .then(() => {
        return Api.post(`${process.env.SERVER_URL}/api/v1/auth/login`, {
          email: USER_EXAMPLE.email,
          password: USER_EXAMPLE.password,
        });
      })
      .then(({ data }) => {
        user = { ...data.user, password: USER_EXAMPLE.password };
        return Api.put(
          `${process.env.SERVER_URL}/api/v1/user/candidat/${user.id}`,
          {
            hidden: false,
          },
          {
            headers: {
              authorization: `Token ${user.token}`,
            },
          }
        );
      })
      .then(() => done());
  });

  after((done) => {
    Api.delete(`${process.env.SERVER_URL}/api/v1/user/${user.id}`)
      .then(() => server.close())
      .then(() => done());
  });

  describe('CRUD CV', () => {
    describe('C - Create 1 CV', () => {
      let cv;

      describe('Sans être connecté', () => {
        it('ne doit pas créer le CV dans la base de données', () => {
          return Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
            cv: JSON.stringify({
              ...CV_EXAMPLE,
              status: 'Published',
              UserId: user.id,
            }),
          })
            .then((res) => {
              cv = res.data;
              assert.fail();
            })
            .catch(assert.isOk);
        }).timeout(TIMEOUT);
      });

      describe('Connecté (candidat)', () => {
        it('doit créer le CV dans la base de données', () => {
          return Api.post(
            `${process.env.SERVER_URL}/api/v1/cv`,
            {
              cv: JSON.stringify({
                ...CV_EXAMPLE,
                status: 'Published',
                UserId: user.id,
              }),
            },
            {
              headers: {
                authorization: `Token ${user.token}`,
              },
            }
          )
            .then((res) => {
              cv = res.data;
              assert.isObject(res.data, 'CV retourné');
            })
            .catch(assert.fail);
        }).timeout(TIMEOUT);

        after((done) => {
          Api.delete(`${process.env.SERVER_URL}/api/v1/cv/${cv.id}`, {
            headers: {
              authorization: `Token ${user.token}`,
            },
          }).then(() => {
            cv = undefined;
            done();
          });
        });
      });
    });

    describe('R - Read 1 CV', () => {
      let cv;
      beforeEach((done) => {
        Api.post(
          `${process.env.SERVER_URL}/api/v1/cv`,
          {
            cv: JSON.stringify({
              ...CV_EXAMPLE,
              status: 'Published',
              UserId: user.id,
            }),
          },
          {
            headers: {
              authorization: `Token ${user.token}`,
            },
          }
        ).then((res) => {
          cv = res.data;
          done();
        });
      });

      afterEach((done) => {
        Api.delete(`${process.env.SERVER_URL}/api/v1/cv/${cv.id}`, {
          headers: {
            authorization: `Token ${user.token}`,
          },
        }).then(() => {
          cv = undefined;
          done();
        });
      });

      describe('Sans être connecté', () => {
        it("doit retourner un CV à l'appel API", () => {
          return Api.get(`${process.env.SERVER_URL}/api/v1/cv`, {
            params: {
              userId: user.id,
            },
          })
            .then((res) => {
              assert.isObject(res.data, 'CV reçu');
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        }).timeout(TIMEOUT);
      });

      describe('Connecté (candidat)', () => {
        it("doit retourner un CV à l'appel API", () => {
          return Api.get(
            `${process.env.SERVER_URL}/api/v1/cv`,
            {
              params: {
                userId: user.id,
              },
            },
            {
              headers: {
                authorization: `Token ${user.token}`,
              },
            }
          )
            .then((res) => {
              assert.isObject(res.data, 'CV reçu');
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        }).timeout(TIMEOUT);
      });
    });

    describe.skip('U - Update 1 CV', () => {
      describe('Sans être connecté', () => {
        it('doit mettre le CV à jour dans la base de données', () => {
          return assert.isOk('Non testable pour le moment');
        }).timeout(TIMEOUT);
      });

      describe('Connecté (candidat)', () => {
        it('doit mettre le CV à jour dans la base de données', () => {
          return assert.isOk('Non testable pour le moment');
        }).timeout(TIMEOUT);
      });
    });

    describe('D - Delete 1 CV', () => {
      let cv;

      describe('Sans être connecté', () => {
        before((done) => {
          Api.post(
            `${process.env.SERVER_URL}/api/v1/cv`,
            {
              cv: JSON.stringify({
                ...CV_EXAMPLE,
                status: 'Published',
                UserId: user.id,
              }),
            },
            {
              headers: {
                authorization: `Token ${user.token}`,
              },
            }
          ).then((res) => {
            cv = res.data;
            done();
          });
        });

        it('ne doit pas supprimer le CV de test dans la base de données', () => {
          return Api.delete(`${process.env.SERVER_URL}/api/v1/cv/${cv.id}`)
            .then((res) => {
              if (res.data === 1) {
                assert.fail('CV supprimé');
              } else {
                assert.isOk('Aucun CV supprimé');
              }
            })
            .catch((err) => assert.isOk('Aucun CV supprimé'));
        }).timeout(TIMEOUT);

        after((done) => {
          Api.delete(`${process.env.SERVER_URL}/api/v1/cv/${cv.id}`, {
            headers: {
              authorization: `Token ${user.token}`,
            },
          }).then(() => {
            cv = undefined;
            done();
          });
        });
      });

      describe('Connecté (candidat)', () => {
        before((done) => {
          Api.post(
            `${process.env.SERVER_URL}/api/v1/cv`,
            {
              cv: JSON.stringify({
                ...CV_EXAMPLE,
                status: 'Published',
                UserId: user.id,
              }),
            },
            {
              headers: {
                authorization: `Token ${user.token}`,
              },
            }
          ).then((res) => {
            cv = res.data;
            done();
          });
        });

        it('doit supprimer le CV de test dans la base de données', () => {
          return Api.delete(`${process.env.SERVER_URL}/api/v1/cv/${cv.id}`, {
            headers: {
              authorization: `Token ${user.token}`,
            },
          })
            .then((res) => {
              if (res.data === 1) {
                assert.isOk('CV supprimé');
              } else {
                assert.fail('Aucun CV supprimé');
              }
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        }).timeout(TIMEOUT);
      });
    });
  });

  describe.skip('Routes CV supplémentaires', () => {
    const arrayCVId = [];

    before(() => {
      const create3CVs = [
        Api.post(
          `${process.env.SERVER_URL}/api/v1/cv`,
          {
            cv: {
              ...CV_EXAMPLE,
              status: 'Published',
              UserId: user.id,
            },
          },
          {
            headers: {
              authorization: `Token ${user.token}`,
            },
          }
        ),
        Api.post(
          `${process.env.SERVER_URL}/api/v1/cv`,
          {
            cv: {
              ...CV_EXAMPLE,
              status: 'Published',
              UserId: user.id,
            },
          },
          {
            headers: {
              authorization: `Token ${user.token}`,
            },
          }
        ),
        Api.post(
          `${process.env.SERVER_URL}/api/v1/cv`,
          {
            cv: {
              ...CV_EXAMPLE,
              status: 'Published',
              UserId: user.id,
            },
          },
          {
            headers: {
              authorization: `Token ${user.token}`,
            },
          }
        ),
      ];
      return Promise.all(create3CVs)
        .then((res) => {
          res.map((cv) => arrayCVId.push(cv.data.id));
          assert.isOk('CVs créés');
        })
        .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
    });

    describe('Récupérer tous les CVs', () => {
      it("doit retourner un tableau de CVs à l'appel API", () => {
        return Api.get(`${process.env.SERVER_URL}/api/v1/cv`)
          .then((res) => {
            assert.isArray(res.data, 'Tableau reçu');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(TIMEOUT);
    });

    describe('Récupérer des CVs aléatoirement', () => {
      it("doit retourner un tableau de CVs aléatoire à l'appel API", () => {
        return Api.get(`${process.env.SERVER_URL}/api/v1/cv/cards/random`)
          .then((res) => {
            assert.isArray(res.data, 'Tableau reçu');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(TIMEOUT);
    });

    describe('Récupérer 2 CVs aléatoirement', () => {
      it("doit retourner un tableau avec 2 CVs à l'appel API", () => {
        return Api.get(`${process.env.SERVER_URL}/api/v1/cv/cards/random?nb=2`)
          .then((res) => {
            assert.isArray(res.data, 'Tableau reçu');
            return res;
          })
          .then((res) => {
            assert.lengthOf(res.data, 2, ' et contenant 2 CVs');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(TIMEOUT);
    });

    after(() => {
      const delete3CVs = [];
      arrayCVId.map((id) =>
        delete3CVs.push(Api.delete(`${process.env.SERVER_URL}/api/v1/cv/${id}`))
      );
      return Promise.all(delete3CVs)
        .then((res) => {
          const result = [];
          res.map(({ data }) => result.push(data));
          console.log(result);
          assert.sameOrderedMembers(
            result,
            [1, 1, 1],
            "Des CVs de tests n'ont pas pu être supprimés"
          );
        })
        .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
    });
  });
});
