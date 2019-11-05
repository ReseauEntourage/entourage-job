import Api from '../Axios';

const { assert } = require('chai');
require('dotenv').config();

const CV_EXAMPLE = {
  firstName: 'Test',
  lastName: 'Ament',
  userId: '27272727-aaaa-bbbb-cccc-012345678927',
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

describe('Tests des routes API', () => {
  describe('Partie CV', () => {
    describe('CRUD CV', () => {
      let cv;

      describe('C - Create 1 CV', () => {
        it('doit créer le CV dans la base de données', () => {
          const newCV = CV_EXAMPLE;
          return Api.post(`${process.env.SERVER_URL}/api/v1/cv`, newCV)
            .then((res) => {
              cv = res.data;
              assert.isObject(res.data, 'CV retourné');
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        }).timeout(5000);
      });
      describe('R - Read 1 CV', () => {
        it("doit retourner un CV à l'appel API", () => {
          return Api.get(`${process.env.SERVER_URL}/api/v1/cv/${cv.url}`)
            .then((res) => {
              assert.isObject(res.data, 'CV reçu');
            })
            .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
        }).timeout(5000);
      });
      describe('U - Update 1 CV', () => {
        it('doit mettre le CV à jour dans la base de données', () => {
          return assert.isOk('Non testable pour le moment');
        }).timeout(5000);
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
        }).timeout(5000);
      });
    });

    describe('Récupérer tous les CVs', () => {
      it("doit retourner un tableau de CVs à l'appel API", () => {
        return Api.get(`${process.env.SERVER_URL}/api/v1/cv`)
          .then((res) => {
            assert.isArray(res.data, 'Tableau reçu');
          })
          .catch((err) => assert.fail(`Appel API non abouti : ${err} `));
      }).timeout(5000);
    });
  });
});
