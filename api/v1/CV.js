/* eslint-disable no-else-return */
// eslint-disable-next-line import/newline-after-import
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const db = require('../../db/config/databaseConnect');
const CV = require('../../db/models/cv')(db, sequelize.DataTypes);
const Skill = require('../../db/models/skill')(db, sequelize.DataTypes);

CV.belongsToMany(Skill, { through: 'CV_Skills' });

/**
 * Titre : Find all CVs
 * Description : Récupère tous les CVs avec les Skills associés
 */
router.get('/', (req, res) => {
  CV.findAll({
    include: [
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

  console.log('Etape 1 :');
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
      console.log('Etape 2 :');
      cvCreated = cv;
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
      console.log('Etape 3 :');
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
      console.log('Etape 4 :');
      return CV.findByPk(cvCreated.dataValues.id, {
        include: [
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
