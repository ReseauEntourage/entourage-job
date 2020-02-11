/* eslint-disable no-restricted-globals */
/* eslint no-param-reassign: ["error", { "props": false }] */

const { models, sequelize } = require('../db/models');
const { cleanCV, controlText } = require('./tools');
const { uploadFile } = require('./aws');

const INCLUDE_ALL_USERS = {
  model: models.User,
  as: 'user',
  attributes: ['id', 'firstName', 'lastName', 'gender', 'email'],
};
const INCLUDE_NOT_HIDDEN_USERS = {
  ...INCLUDE_ALL_USERS,
  where: { hidden: false },
};
const INCLUDES_COMPLETE_CV_WITHOUT_USER = [
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
];
const INCLUDES_COMPLETE_CV_WITH_NOT_HIDDEN_USER = [
  ...INCLUDES_COMPLETE_CV_WITHOUT_USER,
  INCLUDE_NOT_HIDDEN_USERS,
];
const INCLUDES_COMPLETE_CV_WITH_ALL_USER = [
  ...INCLUDES_COMPLETE_CV_WITHOUT_USER,
  INCLUDE_ALL_USERS,
];

const createCV = async (data) => {
  console.log(`createCV - Création du CV`);
  if (data.userId) {
    data.UserId = data.userId;
    delete data.userId;
  }

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
  const { firstName } = await models.User.findByPk(data.UserId, {
    attributes: ['firstName'],
  });
  modelCV.update({
    url: `${firstName.toLowerCase()}-${data.UserId.substring(0, 8)}`,
  });

  // renvoie du cv complet
  console.log(`createCV - Etape finale - Reprendre le CV complet à retourner`);
  const completeCV = await models.CV.findByPk(modelCV.id, {
    exclude: ['UserId'],
    include: INCLUDES_COMPLETE_CV_WITH_ALL_USER,
  });
  return cleanCV(completeCV);
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
    include: INCLUDES_COMPLETE_CV_WITH_NOT_HIDDEN_USER,
    where: { url, status: 'Published' },
    order: [['version', 'DESC']],
  });
  return cleanCV(modelCV);
};

const getVisibleCVbyUrl = async (url) => {
  const modelUser = await models.User.findOne({
    where: { url, hiden: false },
    attributes: ['id'],
  });

  const modelCV = await models.CV.findOne({
    include: INCLUDES_COMPLETE_CV_WITH_ALL_USER,
    where: { status: 'Published', UserId: modelUser.id },
    order: [['version', 'DESC']],
  });

  return cleanCV(modelCV);
};

const getCVbyUserId = async (UserId) => {
  console.log(`getCV - Récupérer un CV non publié à partir du userId`);
  const modelCV = await models.CV.findOne({
    include: INCLUDES_COMPLETE_CV_WITH_ALL_USER,
    where: { UserId },
    order: [['version', 'DESC']],
  });
  return cleanCV(modelCV);
};

const getCVs = async () => {
  console.log(`getCVs - Récupérer les CVs`);
  const modelCVs = await models.CV.findAll({
    where: {
      status: 'Published',
    },
    include: INCLUDES_COMPLETE_CV_WITH_NOT_HIDDEN_USER,
  });
  return modelCVs.map((modelCV) => cleanCV(modelCV));
};

// BIDOUILLE
// TODO Revoir cette query pour prendre les dernieres version et les melanger
// utiliser distinct
const getRandomShortCVs = async (nb) => {
  console.log(
    `getRandomShortCVs - Récupère des CVs au format court de manière aléatoire`
  );
  function getUnique(arr, comp) {
    return (
      arr
        .map((e) => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter((e) => arr[e])
        .map((e) => arr[e])
    );
  }
  /**
   * // TODO
    SELECT cv.*
    FROM "CVs" as cv
    INNER JOIN (
      SELECT "UserId", MAX(version) AS version
      FROM "CVs" c
      WHERE status = 'Published'
      AND visibility = true
      GROUP BY "UserId"
    ) groupedCV
    ON cv."UserId" = groupedCV."UserId"
    AND cv.version = groupedCV.version;
   */
  // const cvs = await sequelize.query(
  //   'SELECT * FROM "CV_Last_Version_Published"',
  //   {
  //     model: models.CV,
  //     mapToModel: true, // pass true here if you have any mapped fields
  //   }
  // );

  const modelCVs = await models.CV.findAll({
    where: {
      status: 'Published',
    },
    // order: sequelize.random(),
    order: [['version', 'DESC']],
    // limit: nb || 11,
    attributes: ['id', 'url', 'version', 'catchphrase'], // [Sequelize.fn('DISTINCT', Sequelize.col('version')) ,'version']
    include: [
      {
        model: models.Ambition,
        as: 'ambitions',
        through: { attributes: [] },
        attributes: ['name'],
      },
      {
        model: models.Skill,
        as: 'skills',
        through: { attributes: [] },
        attributes: ['name'],
      },
      {
        model: models.User,
        as: 'user',
        attributes: ['firstName'],
        where: { hidden: false },
      },
    ],
  });
  const cvs = getUnique(
    modelCVs.map(cleanCV).filter((cv) => cv.user), // filter those who do not have binded user
    'url'
  );
  return cvs.sort(() => Math.random() - 0.5).slice(0, nb); // shuffle and take the nb first
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

const uploadToBucket = (file, UserId) => {
  return uploadFile(file, UserId);
};

module.exports = {
  createCV,
  deleteCV,
  getCVbyUrl,
  getCVbyUserId,
  getCVs,
  getRandomShortCVs,
  setCV,
  uploadToBucket,
};
