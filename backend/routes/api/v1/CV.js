/* eslint-disable no-else-return */
// eslint-disable-next-line import/newline-after-import
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const generateCVPreview = require('../../../shareImage');
const db = require('../../../db/config/databaseConnect');
const CV = require('../../../db/models/cv')(db, sequelize.DataTypes);
const Ambition = require('../../../db/models/ambition')(
  db,
  sequelize.DataTypes
);
const Contract = require('../../../db/models/contract')(
  db,
  sequelize.DataTypes
);
const Experience = require('../../../db/models/experience')(
  db,
  sequelize.DataTypes
);
const Language = require('../../../db/models/language')(
  db,
  sequelize.DataTypes
);
const Passion = require('../../../db/models/passion')(db, sequelize.DataTypes);
const Skill = require('../../../db/models/skill')(db, sequelize.DataTypes);

CV.belongsToMany(Ambition, { through: 'CV_Ambitions' });
CV.belongsToMany(Contract, { through: 'CV_Contracts' });
CV.belongsToMany(Language, { through: 'CV_Languages' });
CV.belongsToMany(Passion, { through: 'CV_Passions' });
CV.belongsToMany(Skill, { through: 'CV_Skills' });
CV.hasMany(Experience);
Experience.belongsTo(CV);

/**
 * Titre : Find all CVs
 * Description : Récupère tous les CVs avec les Skills associés
 */
router.get('/', (req, res) => {
  CV.findAll({
    include: [
      {
        model: Contract,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
      {
        model: Experience,
        attributes: ['id', 'dateStart', 'dateEnd', 'title', 'description'],
      },
      {
        model: Language,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
      {
        model: Passion,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
      {
        model: Skill,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
      {
        model: Ambition,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
    ],
  })
    .then((listeCV) => {
      console.log('All CVs : ', JSON.stringify(listeCV, null, 4));
      res.status(200).json(listeCV);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Titre : Create new CV
 * Description : Récupère tous les CVs avec les Skills associés
 */
router.post('/', (req, res) => {
  let cvCreated;

  console.log('Etape 1 - Création du CV de base :');
  CV.create({
    userId: req.body.userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName || '',
    intro: req.body.intro || '',
    location: req.body.location || '',
    story: req.body.story || '',
    status: req.body.status || 'Draft',
    transport: req.body.transport || '',
    availability: req.body.availability || '',
  })
    .then((cv) => {
      cvCreated = cv;
      console.log('Etape 2 - Skills:');
      if (req.body.skills) {
        console.log("j'ai des skills");
        const skillsPromise = req.body.skills.map((skill) => {
          return Skill.findOrCreate({ where: { name: skill } });
        });
        console.log('SkillPromise créée');
        return Promise.all(skillsPromise);
      } else {
        return Promise.resolve([]);
      }
    })
    .then((skills) => {
      console.log('Etape 3 - Relation CV / Skills:');
      console.log(skills);
      if (skills) {
        console.log('Skills trouvés ou créé');
        console.log(skills);
        const listSkills = skills.map((skill) => {
          return skill[0];
        });
        console.log('Skills propres');
        console.log(listSkills);
        console.log('ListSkills a ', listSkills.length, ' emplacements');
        return cvCreated.addSkills(listSkills);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      console.log('Etape 4 - Langues :');
      if (req.body.languages) {
        console.log("j'ai des langues");
        const languagesPromise = req.body.languages.map((language) => {
          return Language.findOrCreate({ where: { name: language } });
        });
        console.log('languagesPromise créée');
        return Promise.all(languagesPromise);
      } else {
        return Promise.resolve([]);
      }
    })
    .then((languages) => {
      console.log('Etape 5 - Relation CV / Langues :');
      console.log(languages);
      if (languages) {
        console.log('Skills trouvés ou créé');
        console.log(languages);
        const listLanguages = languages.map((language) => {
          return language[0];
        });
        console.log('Skills propres');
        console.log(listLanguages);
        console.log('listLanguages a ', listLanguages.length, ' emplacements');
        return cvCreated.addLanguages(listLanguages);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      if (req.body.contracts) {
        const contractsPromise = req.body.contracts.map((contract) => {
          return Contract.findOrCreate({ where: { name: contract } });
        });
        return Promise.all(contractsPromise);
      } else {
        return Promise.resolve([]);
      }
    })
    .then((contracts) => {
      if (contracts) {
        const listContracts = contracts.map((contract) => {
          return contract[0];
        });
        return cvCreated.addContracts(listContracts);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      if (req.body.passions) {
        const passionsPromise = req.body.passions.map((passion) => {
          return Passion.findOrCreate({ where: { name: passion } });
        });
        return Promise.all(passionsPromise);
      } else {
        return Promise.resolve([]);
      }
    })
    .then((passions) => {
      if (passions) {
        const listPassions = passions.map((passion) => {
          return passion[0];
        });
        return cvCreated.addPassions(listPassions);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      if (req.body.ambitions) {
        const ambitionsPromise = req.body.ambitions.map((ambition) => {
          return Ambition.findOrCreate({ where: { name: ambition } });
        });
        return Promise.all(ambitionsPromise);
      } else {
        return Promise.resolve([]);
      }
    })
    .then((ambitions) => {
      if (ambitions) {
        const listAmbitions = ambitions.map((ambition) => {
          return ambition[0];
        });
        return cvCreated.addAmbitions(listAmbitions);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      if (req.body.experiences) {
        const experiencesPromise = req.body.experiences.map((experience) => {
          return Experience.findOrCreate({
            where: {
              CVId: cvCreated.dataValues.id,
              dateStart: experience.dateStart,
              dateEnd: experience.dateEnd,
              title: experience.title,
              description: experience.description,
            },
          });
        });
        return Promise.all(experiencesPromise);
      } else {
        return Promise.resolve([]);
      }
    })
    .then(() => {
      // creation de limage de preview cv
      generateCVPreview(
        cvCreated.firstName.toUpperCase(),
        "A besoin d'un coup de pouce pour travailler dans...",
        req.body.ambitions.length > 0
          ? req.body.ambitions.join('. ').toUpperCase()
          : '',
        `../../static/img/arthur.png`,
        `../../static/img/${cvCreated.url}-preview.jpg`
      )
        .then(console.log)
        .catch(console.error);
      return Promise.resolve();
    })
    .then(() => {
      console.log('Etape 6 - Reprendre le CV complet :');
      return CV.findByPk(cvCreated.dataValues.id, {
        include: [
          {
            model: Contract,
            through: { attributes: [] },
            attributes: ['id', 'name'],
          },
          {
            model: Experience,
            attributes: ['id', 'dateStart', 'dateEnd', 'title', 'description'],
          },
          {
            model: Language,
            through: { attributes: [] },
            attributes: ['id', 'name'],
          },
          {
            model: Passion,
            through: { attributes: [] },
            attributes: ['id', 'name'],
          },
          {
            model: Skill,
            through: { attributes: [] },
            attributes: ['id', 'name'],
          },
          {
            model: Ambition,
            through: { attributes: [] },
            attributes: ['id', 'name'],
          },
        ],
      });
    })
    .then((cv) => res.status(200).json(cv))
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Find 1 CV  req.params.id
router.get('/:url', (req, res) => {
  const infoLog = 'GET 1 CV -';
  console.log(`${infoLog} Recherche d'un CV`);
  console.log(`${infoLog} ${typeof req.params.url}`);
  console.log(`${infoLog} ${req.params.url}`);
  CV.findOne({
    where: { url: req.params.url },
    include: [
      {
        model: Contract,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
      {
        model: Experience,
        attributes: ['id', 'dateStart', 'dateEnd', 'title', 'description'],
      },
      {
        model: Language,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
      {
        model: Passion,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
      {
        model: Skill,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
      {
        model: Ambition,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
    ],
  })
    .then((cv) => {
      console.log(`${infoLog} CV trouvé`);
      // res.status(200).send(JSON.stringify(cv, null, 4));
      res.status(200).json(cv);
    })
    .catch((err) => {
      console.log(`${infoLog} Aucun CV trouvé`);
      res.status(401).send(err);
    });
});

/**
 * Titre : Récupérer 1 ou plusieurs CV aléatoirement
 * Description : Retourne <nb> CV(s) pour des cartes de manière aléatoire
 * Paramètre :
 * - nb : Nombre de CVs à retourner (11 par défaut)
 * Exemple : <server_url>/api/v1/cv/cards/random?nb=2
 */
router.get('/cards/random', (req, res) => {
  const infoLog = 'GET RANDOM CARD CV -';
  console.log(`${infoLog} Récupération de CVs au hasard pour des cartes`);
  console.log(`${infoLog} ${typeof req.query.nb}`);
  console.log(`${infoLog} ${req.query.nb}`);
  CV.findAll({
    order: db.random(),
    limit: req.query.nb ? req.query.nb : 11,
    attributes: ['id', 'url', 'firstName'],
    include: [
      {
        model: Ambition,
        through: { attributes: [] },
        attributes: ['name'],
      },
    ],
  })
    .then((CVs) => {
      res.status(200).json(CVs);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Titre : Suppression d'un CV à partir de son id
 * Description : Supprime le CV correspondant à l'<id> fournit dans l'URL.
 * Paramètre :
 * - id : ID du CV à supprimer
 * Exemple : <server_url>/api/v1/cv/27272727-aaaa-bbbb-cccc-012345678927
 */
router.delete('/:id', (req, res) => {
  const infoLog = 'DELETE 1 CV -';
  console.log(`${infoLog} Suppression d'un CVs à partir de son id`);
  console.log(`${infoLog} ${typeof req.params.url}`);
  console.log(`${infoLog} ${req.params.url}`);
  CV.destroy({
    where: { id: req.params.id },
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/** **************************************** */
/** ************ A RETRAVAILLER ************ */
/** **************************************** */

/* router.put('/:id', (req, res) => {
  CV.update(
    {
      firstname: req.body.firstname || req.body.firstName,
      lastname: req.body.lastname || req.body.lastName,
      modified_date: moment(new Date()),
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((cv) => {
      console.log('CV updated : ', JSON.stringify(cv, null, 4));
      res.status(200).send(JSON.stringify(cv, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Delete a CV
router.delete('/:id', (req, res) => {
  CV.destroy({
    where: { id: req.params.id },
  })
    .then(() => {
      console.log('CV destroy');
      res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
}); */

module.exports = router;
