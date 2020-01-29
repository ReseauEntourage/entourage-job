/* eslint-disable no-restricted-globals */
const { models, sequelize } = require('../db/models');

// nettoyage des données
function clean(cv) {
  if (!cv) return null;
  const tmpCV = cv.toJSON();
  if (tmpCV.skills) {
    tmpCV.skills = tmpCV.skills.map((o) => o.name);
  }
  if (tmpCV.contracts) {
    tmpCV.contracts = tmpCV.contracts.map((o) => o.name);
  }
  if (tmpCV.languages) {
    tmpCV.languages = tmpCV.languages.map((o) => o.name);
  }
  if (tmpCV.passions) {
    tmpCV.passions = tmpCV.passions.map((o) => o.name);
  }
  if (tmpCV.ambitions) {
    tmpCV.ambitions = tmpCV.ambitions.map((o) => o.name);
  }
  return tmpCV;
}

function controlText(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

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

const createCV = async (data) => {
  console.log(`createCV - Création du CV`);

  const modelCV = await models.CV.create(data);

  // Skills
  if (data.skills) {
    console.log(`createCV - Etape 2 - Skills`);
    const skills = await Promise.all(
      // pour chaque competence
      data.skills.map((name) =>
        // on trouve ou créé la donné
        models.Skill.findOrCreate({
          where: { name: controlText(name) },
        })
          // on recupere de model retourné
          .then((model) => model[0])
      )
    );
    // on ajoute toutes les competences
    modelCV.addSkills(skills);
  }

  // languages
  if (data.languages) {
    console.log(`createCV - Etape 4 - Langues`);
    const languages = await Promise.all(
      data.languages.map((name) =>
        models.Language.findOrCreate({
          where: { name: controlText(name) },
        }).then((model) => model[0])
      )
    );
    modelCV.addLanguages(languages);
  }

  // Contracts
  if (data.contracts) {
    console.log(`createCV - Etape 6 - Contrats`);
    const contracts = await Promise.all(
      data.contracts.map((name) => {
        return models.Contract.findOrCreate({
          where: { name: controlText(name) },
        }).then((model) => model[0]);
      })
    );
    modelCV.addContracts(contracts);
  }

  // Passions
  if (data.passions) {
    console.log(`createCV - Etape 8 - Passions`);
    const passions = await Promise.all(
      data.passions.map((name) => {
        return models.Passion.findOrCreate({
          where: { name: controlText(name) },
        }).then((model) => model[0]);
      })
    );
    modelCV.addPassions(passions);
  }

  // Ambitions
  if (data.ambitions) {
    console.log(`createCV - Etape 10 - Ambitions`);
    const ambitions = await Promise.all(
      data.ambitions.map((name) => {
        return models.Ambition.findOrCreate({
          where: { name: controlText(name) },
        }).then((model) => model[0]);
      })
    );
    modelCV.addAmbitions(ambitions);
  }

  // Experiences
  if (data.experiences) {
    console.log(`createCV - Etape 11 - Expériences`);
    data.experiences.forEach((experience) =>
      models.Experience.create({
        CVId: modelCV.id,
        dateStart: experience.dateStart,
        dateEnd: experience.dateEnd,
        title: experience.title,
        description: experience.description,
      })
    );
  }

  // Reviews
  if (data.reviews) {
    console.log(`createCV - Etape 11 - Expériences`);
    data.reviews.forEach((review) =>
      models.Review.create({
        CVId: modelCV.id,
        text: review.text,
        status: review.status,
        name: review.name,
      })
    );
  }

  // si possible le faire à la creation du cv
  const { firstName } = await models.User.findByPk(data.userId, {
    attributes: ['firstName'],
  });
  modelCV.update({
    url: `${firstName.toLowerCase()}-${data.userId.substring(0, 8)}`,
  });

  // renvoie du cv complet
  console.log(`createCV - Etape finale - Reprendre le CV complet à retourner`);
  const completeCV = await models.CV.findByPk(modelCV.id, {
    exclude: ['userId'],
    include: INCLUDE_CV_COMPLETE,
  });
  return clean(completeCV);
};

const deleteCV = (id) => {
  console.log(`deleteCV - Suppression d'un CV à partir de son id`);
  return models.CV.destroy({
    where: { id },
  });
};

const getCVbyUrl = async (url) => {
  console.log(`getCVbyUrl - Récupérer un CV à partir de son url`);
  const modelCV = await models.CV.findOne({
    include: INCLUDE_CV_COMPLETE,
    where: { url, status: 'Published', visibility: true },
    order: [['version', 'DESC']],
  });
  return clean(modelCV);
};

const getCVbyUserId = async (userId) => {
  console.log(`getCV - Récupérer un CV non publié à partir du userId`);
  const modelCV = await models.CV.findOne({
    include: INCLUDE_CV_COMPLETE,
    where: { userId },
    order: [['version', 'DESC']],
  });
  return clean(modelCV);
};

const getCVs = async () => {
  console.log(`getCVs - Récupérer les CVs`);
  const modelCVs = await models.CV.findAll({
    where: {
      status: 'Published',
      visibility: true,
    },
    include: INCLUDE_CV_COMPLETE,
  });
  return modelCVs.map((modelCV) => clean(modelCV));
};

const getRandomShortCVs = async (nb) => {
  console.log(
    `getRandomShortCVs - Récupère des CVs au format court de manière aléatoire`
  );
  const modelCVs = await models.CV.findAll({
    where: {
      status: 'Published',
      visibility: true,
    },
    order: sequelize.random(),
    limit: nb || 11,
    attributes: ['id', 'url'],
    include: [
      {
        model: models.Ambition,
        as: 'ambitions',
        through: { attributes: [] },
        attributes: ['name'],
      },
      {
        model: models.User,
        as: 'user',
        attributes: ['firstName'],
      },
    ],
  });
  return modelCVs.map((modelCV) => clean(modelCV));
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
