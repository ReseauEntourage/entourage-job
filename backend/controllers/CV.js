/* eslint-disable no-restricted-globals */
/* eslint no-param-reassign: ["error", { "props": false }] */

const { QueryTypes } = require('sequelize');
const { models, sequelize } = require('../db/models');
const { cleanCV, controlText } = require('./tools');

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

// todo: revoir !!!
const queryConditionCV = (attribute, value, allowHidden) =>
  `
SELECT cv.id
FROM "CVs" cv
inner join (
  select "UserId", MAX(version) as version
  from "CVs"
  where "CVs".status = 'Published'
  group by "UserId") groupCVs
on cv."UserId" = groupCVs."UserId"
and cv."version" =  groupCVs.version
inner join (
  select distinct id, "firstName", url
  from "Users"
  where ${allowHidden ? '' : ` hidden = false `}
  ${attribute && value && !allowHidden ? ' and ' : ''}
  ${attribute && value ? ` ${attribute} = '${value}'` : ''}) groupUsers
on cv."UserId" = groupUsers.id`;

const createCV = async (data) => {
  console.log(`createCV - Création du CV`);
  if (data.userId) {
    data.UserId = data.userId;
    delete data.userId;
  }

  const modelCV = await models.CV.create(data); // TODO VERIFIER LES ENTREES

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

// todo: revoir
const getCVbyUrl = async (url) => {
  console.log(`getCVbyUrl - Récupérer un CV ${url}`);
  const cvs = await sequelize.query(queryConditionCV('url', url), {
    type: QueryTypes.SELECT,
  });

  const modelCV = await models.CV.findByPk(cvs[0].id, {
    include: [
      ...INCLUDES_COMPLETE_CV_WITHOUT_USER,
      {
        model: models.User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'gender', 'email'],
      },
    ],
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

// todo: revoir
const getCVbyUserId = async (userId) => {
  console.log(`getCVByUserId ${userId}`);
  const modelCV = await models.CV.findOne({
    include: INCLUDES_COMPLETE_CV_WITH_ALL_USER,
    where: {
      UserId: userId,
    },
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

  const cvs = await sequelize.query(queryConditionCV(), {
    type: QueryTypes.SELECT,
  });
  const modelCVs = await models.CV.findAll({
    where: { id: cvs.map((cv) => cv.id) },
    attributes: ['catchphrase', 'urlImg'],
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
        attributes: ['firstName', 'url'],
      },
    ],
  });

  return modelCVs
    .map(cleanCV)
    .sort(() => Math.random() - 0.5)
    .slice(0, nb); // shuffle and take the nb first
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

module.exports = {
  createCV,
  deleteCV,
  getCVbyUrl,
  getCVbyUserId,
  getCVs,
  getRandomShortCVs,
  setCV,
};
