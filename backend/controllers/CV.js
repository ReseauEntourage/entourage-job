/* eslint-disable no-restricted-globals */
const sequelize = require('sequelize');
const models = require('../db/models');

const INCLUDE_CV_COMPLETE = [
  {
    model: models.Contract,
    as: 'contracts',
    through: { attributes: [] },
    attributes: ['id', 'name'],
  },
  {
    model: models.Language,
    as: 'languages',
    through: { attributes: [] },
    attributes: ['id', 'name'],
  },
  {
    model: models.Passion,
    as: 'passions',
    through: { attributes: [] },
    attributes: ['id', 'name'],
  },
  {
    model: models.Skill,
    as: 'skills',
    through: { attributes: [] },
    attributes: ['id', 'name'],
  },
  {
    model: models.Ambition,
    as: 'ambitions',
    through: { attributes: [] },
    attributes: ['id', 'name'],
  },
  {
    model: models.Experience,
    as: 'experiences',
    attributes: ['id', 'dateStart', 'dateEnd', 'title', 'description'],
  },
  {
    model: models.Review,
    as: 'reviews',
    attributes: ['id', 'text', 'status', 'name'],
  },
  {
    model: models.User,
    as: 'user',
    attributes: ['id', 'firstName', 'lastName', 'gender', 'email'],
  },
];

const createCV = (data) => {
  return new Promise((resolve, reject) => {
    console.log(`createCV - Création du CV`);

    models.CV.create(data).then((modelCV) => {
      // Skills
      if (data.skills) {
        console.log(`createCV - Etape 2 - Skills`);
        data.skills.forEach(async (skill) => {
          const modelSkill = await models.Skill.findOrCreate({
            where: { name: skill },
          });
          modelCV.addSkill(modelSkill);
        });
      }

      // languages
      if (data.languages) {
        console.log(`createCV - Etape 4 - Langues`);
        data.languages.map(async (language) => {
          const modelLanguage = await models.Language.findOrCreate({
            where: { name: language },
          });
          modelCV.addLanguage(modelLanguage);
        });
      }

      // Contracts
      if (data.contracts) {
        console.log(`createCV - Etape 6 - Contrats`);
        data.contracts.map(async (contract) => {
          const modelContract = await models.Contract.findOrCreate({
            where: { name: contract },
          });
          modelCV.addContract(modelContract);
        });
      }

      // Passions
      if (data.passions) {
        console.log(`createCV - Etape 8 - Passions`);
        data.passions.map(async (passion) => {
          const modelPassion = await models.Passion.findOrCreate({
            where: { name: passion },
          });
          modelCV.addPassion(modelPassion);
        });
      }

      // Ambitions
      if (data.ambitions) {
        console.log(`createCV - Etape 10 - Ambitions`);
        data.ambitions.map(async (ambition) => {
          const modelAmbition = await models.Ambition.findOrCreate({
            where: { name: ambition },
          });
          modelCV.addAmbition(modelAmbition);
        });
      }

      if (data.experiences) {
        console.log(`createCV - Etape 11 - Expériences`);
        data.experiences.map((experience) =>
          models.Experience.findOrCreate({
            where: {
              CVId: modelCV.id,
              dateStart: experience.dateStart,
              dateEnd: experience.dateEnd,
              title: experience.title,
              description: experience.description,
            },
          })
        );
      }

      if (data.reviews) {
        console.log(`createCV - Etape 11 - Expériences`);
        data.reviews.map((review) =>
          models.Review.findOrCreate({
            where: {
              CVId: modelCV.id,
              text: review.text,
              status: review.status,
              name: review.name,
              description: review.description,
            },
          })
        );
      }

      console.log(
        `createCV - Etape finale - Reprendre le CV complet à retourner`
      );
      return models.CV.findByPk(modelCV.id, {
        include: INCLUDE_CV_COMPLETE,
      })
        .then(resolve)
        .catch(reject);
    });
  });
};

const deleteCV = (id) => {
  console.log(`deleteCV - Suppression d'un CV à partir de son id`);
  return models.CV.destroy({
    where: { id },
  });
};

const getCVbyUrl = (url) => {
  console.log(`getCVbyUrl - Récupérer un CV à partir de son url`);
  return models.CV.max('version', {
    where: {
      status: 'Published',
      visibility: true,
      url,
    },
  }).then((version) => {
    if (isNaN(version)) {
      return Promise.resolve(null);
    }
    return models.CV.findOne({
      where: { url, status: 'Published', version, visibility: true },
      include: INCLUDE_CV_COMPLETE,
    });
  });
};

const getCVbyUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getCV -';
    console.log(`${infoLog} Récupérer un CV non publié à partir du userId`);
    models.CV.max('version', {
      where: {
        userId,
      },
    })
      .then((version) => {
        if (isNaN(version)) {
          return Promise.resolve(null);
        }
        return models.CV.findOne({
          where: { userId, version },
          include: INCLUDE_CV_COMPLETE,
        });
      })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getCVs = () => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getCVs -';
    console.log(`${infoLog} Récupérer les CVs`);
    models.CV.findAll({
      where: {
        status: 'Published',
        visibility: true,
      },
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
    models.CV.findAll({
      where: {
        status: 'Published',
        visibility: true,
      },
      order: db.random(),
      limit: nb || 11,
      attributes: ['id', 'url', 'firstName'],
      include: [
        {
          model: models.Ambition,
          through: { attributes: [] },
          attributes: ['name'],
        },
      ],
    })
      .then((listeCVs) => resolve(listeCVs))
      .catch((err) => reject(err));
  });
};

const getVisibility = (userId) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getVisibility -';
    console.log(
      `${infoLog} Recherche de l'état visibility du dernier CV publié de l'utilisateur`
    );
    models.CV.findOne({
      where: {
        status: 'Published',
        userId,
      },
      attributes: ['visibility', sequelize.fn('max', sequelize.col('version'))],
      group: ['visibility'],
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const setCV = (id, cv) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'setCV -';
    console.log(`${infoLog} Modification du CV`);
    models.CV.update(cv, {
      where: { id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const setVisibility = (userId, cv) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'setVisibility -';
    console.log(
      `${infoLog} Recherche de l'état visibility du dernier CV publié de l'utilisateur`
    );
    models.CV.max('version', {
      where: {
        status: 'Published',
        userId,
      },
    })
      .then((max) => {
        return models.CV.update(cv, {
          where: {
            status: 'Published',
            userId,
            version: max,
          },
          fields: ['visibility'],
          returning: true,
        });
      })
      .then((result) => {
        resolve({ visibility: result[1][0].visibility });
      })
      .catch((err) => reject(err));
  });
};

module.exports = {
  createCV,
  deleteCV,
  getCVbyUrl,
  getCVbyUserId,
  getCVs,
  getRandomShortCVs,
  getVisibility,
  setCV,
  setVisibility,
};
