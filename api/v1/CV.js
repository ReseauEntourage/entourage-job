/* eslint-disable no-else-return */
// eslint-disable-next-line import/newline-after-import
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const db = require('../../db/config/databaseConnect');
const CV = require('../../db/models/cv')(db, sequelize.DataTypes);
const Contract = require('../../db/models/contract')(db, sequelize.DataTypes);
const Experience = require('../../db/models/experience')(
  db,
  sequelize.DataTypes
);
const Language = require('../../db/models/language')(db, sequelize.DataTypes);
const Passion = require('../../db/models/passion')(db, sequelize.DataTypes);
const Skill = require('../../db/models/skill')(db, sequelize.DataTypes);

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
    ],
  })
    .then((listeCV) => {
      console.log('All CVs : ', JSON.stringify(listeCV, null, 4));
      res.status(200).send(JSON.stringify(listeCV, null, 4));
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
    firstName: req.body.firstName,
    lastName: req.body.lastName || '',
    intro: req.body.intro || '',
    location: req.body.location || '',
    story: req.body.story || '',
    status: req.body.status || 'Draft',
    transport: req.body.transport || '',
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
        ],
      });
    })
    .then((cv) => res.status(200).send(JSON.stringify(cv, null, 4)))
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Find 1 CV  req.params.id
router.get('/:id', (req, res) => {
  CV.findByPk(req.params.id, {
    include: [
      {
        model: Skill,
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
    ],
  })
    .then((cv) => {
      console.log('CV trouvé: ', JSON.stringify(cv, null, 4));
      res.status(200).send(JSON.stringify(cv, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
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
