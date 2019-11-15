const sequelize = require('sequelize');
const db = require('../db/config/databaseConnect');
const CV = require('../db/models/cv')(db, sequelize.DataTypes);
const Ambition = require('../db/models/ambition')(db, sequelize.DataTypes);
const Contract = require('../db/models/contract')(db, sequelize.DataTypes);
const Experience = require('../db/models/experience')(db, sequelize.DataTypes);
const Language = require('../db/models/language')(db, sequelize.DataTypes);
const Passion = require('../db/models/passion')(db, sequelize.DataTypes);
const Skill = require('../db/models/skill')(db, sequelize.DataTypes);

const INCLUDE_CV_COMPLETE = [
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
];

CV.belongsToMany(Ambition, { through: 'CV_Ambitions' });
CV.belongsToMany(Contract, { through: 'CV_Contracts' });
CV.belongsToMany(Language, { through: 'CV_Languages' });
CV.belongsToMany(Passion, { through: 'CV_Passions' });
CV.belongsToMany(Skill, { through: 'CV_Skills' });
CV.hasMany(Experience);
Experience.belongsTo(CV);

const createCV = (newCV) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'createCV -';
    console.log(`${infoLog} Création du CV`);

    let cvCreated;

    console.log(`${infoLog} Etape 1 - Création du CV de base`);
    CV.create({
      userId: newCV.userId,
      firstName: newCV.firstName,
      lastName: newCV.lastName || '',
      intro: newCV.intro || '',
      location: newCV.location || '',
      story: newCV.story || '',
      status: newCV.status || 'Draft',
      transport: newCV.transport || '',
      availability: newCV.availability || '',
    })
      .then((cv) => {
        cvCreated = cv;
        console.log(`${infoLog} Etape 2 - Skills`);
        if (newCV.skills) {
          console.log(`${infoLog} Skills présents à contrôler ou créer`);
          const skillsPromise = newCV.skills.map((skill) => {
            return Skill.findOrCreate({ where: { name: skill } });
          });
          return Promise.all(skillsPromise);
        }
        return Promise.resolve([]);
      })
      .then((skills) => {
        console.log(`${infoLog} Etape 3 - Relation CV / Skills`);
        if (skills) {
          console.log(`${infoLog} Skills trouvés ou créés`);
          const listSkills = skills.map((skill) => {
            return skill[0];
          });
          console.log(`${infoLog} Ajout de la relation avec le CV`);
          return cvCreated.addSkills(listSkills);
        }
        return Promise.resolve();
      })
      .then(() => {
        console.log(`${infoLog} Etape 4 - Langues`);
        if (newCV.languages) {
          console.log(`${infoLog} Langues présentes à contrôler ou créer`);
          const languagesPromise = newCV.languages.map((language) => {
            return Language.findOrCreate({ where: { name: language } });
          });
          return Promise.all(languagesPromise);
        }
        return Promise.resolve([]);
      })
      .then((languages) => {
        console.log(`${infoLog} Etape 5 - Relation CV / Langues :`);
        if (languages) {
          console.log(`${infoLog} Langues trouvés ou créés`);
          const listLanguages = languages.map((language) => {
            return language[0];
          });
          console.log(`${infoLog} Ajout de la relation avec le CV`);
          return cvCreated.addLanguages(listLanguages);
        }
        return Promise.resolve();
      })
      .then(() => {
        console.log(`${infoLog} Etape 6 - Contrats`);
        if (newCV.contracts) {
          console.log(`${infoLog} Contrats présents à contrôler ou créer`);
          const contractsPromise = newCV.contracts.map((contract) => {
            return Contract.findOrCreate({ where: { name: contract } });
          });
          return Promise.all(contractsPromise);
        }
        return Promise.resolve([]);
      })
      .then((contracts) => {
        console.log(`${infoLog} Etape 7 - Relation CV / Contrats`);
        if (contracts) {
          console.log(`${infoLog} Contrats trouvés ou créés`);
          const listContracts = contracts.map((contract) => {
            return contract[0];
          });
          console.log(`${infoLog} Ajout de la relation avec le CV`);
          return cvCreated.addContracts(listContracts);
        }
        return Promise.resolve();
      })
      .then(() => {
        console.log(`${infoLog} Etape 8 - Passions`);
        if (newCV.passions) {
          console.log(`${infoLog} Passions présents à contrôler ou créer`);
          const passionsPromise = newCV.passions.map((passion) => {
            return Passion.findOrCreate({ where: { name: passion } });
          });
          return Promise.all(passionsPromise);
        }
        return Promise.resolve([]);
      })
      .then((passions) => {
        console.log(`${infoLog} Etape 9 - Relation CV / Passions`);
        if (passions) {
          console.log(`${infoLog} Passions trouvés ou créés`);
          const listPassions = passions.map((passion) => {
            return passion[0];
          });
          console.log(`${infoLog} Ajout de la relation avec le CV`);
          return cvCreated.addPassions(listPassions);
        }
        return Promise.resolve();
      })
      .then(() => {
        console.log(`${infoLog} Etape 10 - Ambitions`);
        if (newCV.ambitions) {
          console.log(`${infoLog} Ambitions présentes à contrôler ou créer`);
          const ambitionsPromise = newCV.ambitions.map((ambition) => {
            return Ambition.findOrCreate({ where: { name: ambition } });
          });
          return Promise.all(ambitionsPromise);
        }
        return Promise.resolve([]);
      })
      .then((ambitions) => {
        console.log(`${infoLog} Etape 11 - Relation CV / Ambitions`);
        if (ambitions) {
          console.log(`${infoLog} Ambitions trouvés ou créés`);
          const listAmbitions = ambitions.map((ambition) => {
            return ambition[0];
          });
          console.log(`${infoLog} Ajout de la relation avec le CV`);
          return cvCreated.addAmbitions(listAmbitions);
        }
        return Promise.resolve();
      })
      .then(() => {
        console.log(`${infoLog} Etape 11 - Expériences`);
        if (newCV.experiences) {
          console.log(`${infoLog} Expériences présentes à créer`);
          const experiencesPromise = newCV.experiences.map((experience) => {
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
        }
        return Promise.resolve([]);
      })
      .then(() => {
        console.log(
          `${infoLog} Etape finale - Reprendre le CV complet à retourner`
        );
        return CV.findByPk(cvCreated.dataValues.id, {
          include: INCLUDE_CV_COMPLETE,
        });
      })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const deleteCV = (id) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'deleteCV -';
    console.log(`${infoLog} Suppression d'un CV à partir de son id`);
    CV.destroy({
      where: { id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getCV = (url) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getCV -';
    console.log(`${infoLog} Récupérer un CV à partir de son url`);
    CV.findOne({
      where: { url },
      include: INCLUDE_CV_COMPLETE,
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getCVs = () => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getCVs -';
    console.log(`${infoLog} Récupérer les CVs`);
    CV.findAll({
      include: INCLUDE_CV_COMPLETE,
    })
      .then((listeCVs) => resolve(listeCVs))
      .catch((err) => reject(err));
  });
};

const getRandomShortCVs = (nb) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getRandomShortCVs -';
    console.log(
      `${infoLog} Récupère des CVs au format court de manière aléatoire`
    );
    CV.findAll({
      order: db.random(),
      limit: nb || 11,
      attributes: ['id', 'url', 'firstName'],
      include: [
        {
          model: Ambition,
          through: { attributes: [] },
          attributes: ['name'],
        },
      ],
    })
      .then((listeCVs) => resolve(listeCVs))
      .catch((err) => reject(err));
  });
};

const setCV = (id, cv) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'setCV -';
    console.log(`${infoLog} Modification du CV`);
    CV.update(cv, {
      where: { id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

module.exports = {
  createCV,
  deleteCV,
  getCV,
  getCVs,
  getRandomShortCVs,
  setCV,
};
