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
      dateStart: 'Octobre 2008',
      dateEnd: 'Juillet 2011',
      title: 'Magasinier & gestion des stocks',
      description: 'Chez Joyau, Espagne',
    },
    {
      dateStart: 'Janvier 2012',
      dateEnd: 'Février 2014',
      title: 'Opérateur sur presse (intérim)',
      description:
        'Société PFI à Lognes (77). (Fabrication de pièces automobiles, contrôle de qualité, mise des pièces en bac et étiquetage, fiches clients)',
    },
    {
      dateStart: '2019',
      dateEnd: '2019',
      title: 'Formations',
      description:
        'Monteur Raccordeur en FTTH \nHOBO (Electricité Haute et Basse tension)',
    },
    {
      dateStart: 'Août 2017',
      dateEnd: 'Mars 2019',
      title: 'Logisticien polyvalent',
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
  email: 'test@test.test',
  firstName: 'Luigi',
  lastName: 'Mario',
  password: 'azerty',
};

describe.skip('Tests des routes API - Partie CV', () => {
  let user;

  before((done) => {
    server.prepare();
    server
      .start(PORT)
      .then(() =>
        Api.post(`${process.env.SERVER_URL}/api/v1/user`, USER_EXAMPLE)
      )
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

  after(() => {
    server.close();
  });

  describe('CRUD CV', () => {
    let cv;

    describe('C - Create 1 CV', () => {
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
              'Content-Type': 'multipart/form-data',
            },
          }
        )
          .then((res) => {
            cv = res.data;
            assert.isObject(res.data, 'CV retourné');
          })
          .catch(assert.fail);
      }).timeout(TIMEOUT);
    });
    describe.skip('R - Read 1 CV', () => {
      it("doit retourner un CV à l'appel API", () => {
        return Api.get(`${process.env.SERVER_URL}/api/v1/cv/${cv.user.url}`)
          .then((res) => {
            assert.isObject(res.data, 'CV reçu');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(TIMEOUT);
    });
    describe('U - Update 1 CV', () => {
      it('doit mettre le CV à jour dans la base de données', () => {
        return assert.isOk('Non testable pour le moment');
      }).timeout(TIMEOUT);
    });
    describe('D - Delete 1 CV', () => {
      it('doit supprimer le CV de test dans la base de données', () => {
        return Api.delete(`${process.env.SERVER_URL}/api/v1/cv/${cv.id}`)
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

  describe('Routes CV supplémentaires', () => {
    const arrayCVId = [];

    before.skip(() => {
      const create3CVs = [
        Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
          cv: {
            ...CV_EXAMPLE,
            status: 'Published',
            UserId: user.id,
          },
        }),
        Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
          cv: {
            ...CV_EXAMPLE,
            status: 'Published',
            UserId: user.id,
          },
        }),
        Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
          cv: {
            ...CV_EXAMPLE,
            status: 'Published',
            UserId: user.id,
          },
        }),
      ];
      return Promise.all(create3CVs)
        .then((res) => {
          res.map((cv) => arrayCVId.push(cv.data.id));
          console.log(arrayCVId);
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

    describe.skip('Récupérer 2 CVs aléatoirement', () => {
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

    describe.skip('Récupérer la visibilité de son CV', () => {
      describe('sans être connecté', () => {
        it('doit retourner une erreur car non connecté', () => {
          return Api.get(`${process.env.SERVER_URL}/api/v1/cv/visibility`)
            .then((res) => {
              assert.strictEqual(res.status, 401, 'Accès non autorisé attendu');
            })
            .catch((err) => {
              assert.strictEqual(
                err.response.status,
                401,
                'Accès non autorisé attendu'
              );
            });
        }).timeout(TIMEOUT);
      });
      describe('une fois connecté', () => {
        let userId;
        let token;
        let CVId;

        before(() => {
          return Api.post(`${process.env.SERVER_URL}/api/v1/user`, USER_EXAMPLE)
            .then((res) => {
              if (!res.data.id) {
                assert.fail(`userId manquant `);
              }
              userId = res.data.id;
              console.log(`Nouveau userId : ${userId}`);
              return Api.post(
                `${process.env.SERVER_URL}/api/v1/auth/login`,
                USER_EXAMPLE
              );
            })
            .then((res) => {
              if (!res.data.user) {
                assert.fail(`User non connecté`);
              }
              token = res.data.user.token;
              return Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                cv: {
                  ...CV_EXAMPLE,
                  status: 'Published',
                  UserId: userId,
                },
              });
            })
            .then((res) => {
              if (!res.data.id) {
                assert.fail(`Le CV de test n'a pas pu être créé`);
              }
              CVId = res.data.id;
              assert.isOk('CV créé');
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        });

        it.skip("doit retourner l'état du CV", () => {
          return Api.get(`${process.env.SERVER_URL}/api/v1/cv/visibility`, {
            headers: { authorization: `Token ${token}` },
          })
            .then((res) => {
              console.log(res.data);
              assert.isBoolean(
                res.data.visibility,
                'La visibilité du CV actuel est retourné'
              );
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        }).timeout(TIMEOUT);

        after(() => {
          return Api.delete(`${process.env.SERVER_URL}/api/v1/cv/${CVId}`)
            .then((res) => {
              if (!res.data) {
                assert.fail(`Le CV n'a pas pu être supprimé`);
              }
              return Api.delete(
                `${process.env.SERVER_URL}/api/v1/user/${userId}`
              );
            })
            .then((res) => {
              assert.strictEqual(res.status, 200, 'User de test supprimé');
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        });
      });
    });

    describe('Modifier la visibilité de son CV', () => {
      describe('sans être connecté', () => {
        it.skip('doit retourner une erreur car non connecté', () => {
          return Api.put(`${process.env.SERVER_URL}/api/v1/cv/visibility`, {
            visibility: false,
          })
            .then((res) => {
              assert.strictEqual(res.status, 401, 'Accès non autorisé attendu');
            })
            .catch((err) => {
              assert.strictEqual(
                err.response.status,
                401,
                'Accès non autorisé attendu'
              );
            });
        }).timeout(TIMEOUT);
      });
      describe('une fois connecté', () => {
        let userId;
        let token;
        let CVId;

        before(() => {
          return Api.post(`${process.env.SERVER_URL}/api/v1/user`, USER_EXAMPLE)
            .then((res) => {
              if (!res.data.id) {
                assert.fail(`userId manquant `);
              }
              userId = res.data.id;
              console.log(`Nouveau userId : ${userId}`);
              return Api.post(
                `${process.env.SERVER_URL}/api/v1/auth/login`,
                USER_EXAMPLE
              );
            })
            .then((res) => {
              if (!res.data.user) {
                assert.fail(`User non connecté`);
              }
              token = res.data.user.token;
              return Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                cv: {
                  ...CV_EXAMPLE,
                  status: 'Published',
                  UserId: userId,
                },
              });
            })
            .then((res) => {
              if (!res.data.id) {
                assert.fail(`Le CV de test n'a pas pu être créé`);
              }
              CVId = res.data.id;
              assert.isOk('CV créé');
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        });

        it.skip(
          'doit modifier et retourner la nouvelle visibilité du CV',
          () => {
            return Api.put(
              `${process.env.SERVER_URL}/api/v1/cv/visibility`,
              { visibility: false },
              {
                headers: { authorization: `Token ${token}` },
              }
            )
              .then((res) => {
                console.log(res.data);
                assert.isBoolean(
                  res.data.visibility,
                  'La visibilité du CV actuel est retourné'
                );
                assert.strictEqual(
                  res.data.visibility,
                  false,
                  'Le nouvel état a bien été pris en compte'
                );
              })
              .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
          }
        ).timeout(TIMEOUT);

        after(() => {
          return Api.delete(`${process.env.SERVER_URL}/api/v1/cv/${CVId}`)
            .then((res) => {
              if (!res.data) {
                assert.fail(`Le CV n'a pas pu être supprimé`);
              }
              return Api.delete(
                `${process.env.SERVER_URL}/api/v1/user/${userId}`
              );
            })
            .then((res) => {
              assert.strictEqual(res.status, 200, 'User de test supprimé');
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        });
      });
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
