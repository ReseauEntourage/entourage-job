/* eslint-disable no-restricted-globals */
/* eslint no-param-reassign: ["error", { "props": false }] */

const {QueryTypes} = require('sequelize');
const {
  models,
  sequelize,
  // Sequelize: { Op, fn, col, where },
} = require('../db/models');

const {cleanCV, escapeColumn, escapeQuery} = require('../utils');

const {CV_STATUS} = require('../../constants');

const INCLUDE_ALL_USERS = {
  model: models.User_Candidat,
  as: 'user',
  attributes: ['employed', 'hidden', 'url'],
  include: [
    {
      model: models.User,
      as: 'coach',
      attributes: ['id', 'firstName', 'lastName', 'gender'],
    },
    {
      model: models.User,
      as: 'candidat',
      attributes: ['id', 'firstName', 'lastName', 'gender'],
    },
  ],
};
const INCLUDE_NOT_HIDDEN_USERS = {
  ...INCLUDE_ALL_USERS,
  where: {hidden: false},
};
const INCLUDES_COMPLETE_CV_WITHOUT_USER = [
  {
    model: models.Contract,
    as: 'contracts',
    through: {attributes: []},
    attributes: ['id', 'name'],
  },
  {
    model: models.Language,
    as: 'languages',
    through: {attributes: []},
    attributes: ['id', 'name'],
  },
  {
    model: models.Passion,
    as: 'passions',
    through: {attributes: []},
    attributes: ['id', 'name'],
  },
  {
    model: models.Skill,
    as: 'skills',
    through: {attributes: []},
    attributes: ['id', 'name'],
  },
  {
    model: models.Ambition,
    as: 'ambitions',
    through: {attributes: []},
    attributes: ['id', 'name'],
  },
  {
    model: models.BusinessLine,
    as: 'businessLines',
    through: {attributes: []},
    attributes: ['id', 'name'],
  },
  {
    model: models.Location,
    as: 'locations',
    through: {attributes: []},
    attributes: ['id', 'name'],
  },
  {
    model: models.Experience,
    as: 'experiences',
    attributes: ['id', 'description', 'order'],
    include: [
      {
        model: models.Skill,
        as: 'skills',
        through: {attributes: []},
        attributes: ['id', 'name'],
      },
    ],
    order: [
      ['order', 'ASC'],
    ]
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
// permet de recuperer les id de cv recherchés pour ensuite fetch ses données
const queryConditionCV = (attribute, value, allowHidden) => `
  SELECT cv.id
  FROM "CVs" cv
  inner join (
    select "UserId", MAX(version) as version
    from "CVs"
    where "CVs".status = '${CV_STATUS.Published.value}'
    group by "UserId") groupCVs
  on cv."UserId" = groupCVs."UserId"
  and cv.version =  groupCVs.version
  and cv.status = '${CV_STATUS.Published.value}'
  inner join (
    select distinct "candidatId"
    from "User_Candidats"
    where ${allowHidden ? '' : ` hidden = false `}
    ${attribute && value && !allowHidden ? ' and ' : ''}
    ${attribute && value ? ` ${attribute} = '${value}'` : ''}) groupUsers
  on cv."UserId" = groupUsers."candidatId"`;

const createCV = async (data) => {
  console.log(`createCV - Création du CV`);
  if (data.userId) {
    data.UserId = data.userId;
    delete data.userId;
  }

  const modelCV = await models.CV.create(data); // TODO VERIFIER LES ENTREES

  // Skills
  if (data.skills) {
    console.log(`createCV - Skills`);
    const skills = await Promise.all(
      // pour chaque competence
      data.skills.map((name) =>
        // on trouve ou créé la donné
        models.Skill.findOrCreate({
          where: {name},
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
    console.log(`createCV - Langues`);
    const languages = await Promise.all(
      // pour chaque competence
      data.languages.map((name) =>
        // on trouve ou créé la donné
        models.Language.findOrCreate({
          where: {name},
          // on recupere de model retourné
        }).then((model) => model[0])
      )
    );
    // on ajoute toutes les competences
    modelCV.addLanguages(languages);
  }

  // Contracts
  if (data.contracts) {
    console.log(`createCV - Contrats`);
    const contracts = await Promise.all(
      data.contracts.map((name) => {
        return models.Contract.findOrCreate({
          where: {name},
        }).then((model) => model[0]);
      })
    );
    modelCV.addContracts(contracts);
  }

  // Passions
  if (data.passions) {
    console.log(`createCV - Passions`);
    const passions = await Promise.all(
      data.passions.map((name) => {
        return models.Passion.findOrCreate({
          where: {name},
        }).then((model) => model[0]);
      })
    );
    modelCV.addPassions(passions);
  }

  // Ambitions
  if (data.ambitions) {
    console.log(`createCV - Ambitions`);
    const ambitions = await Promise.all(
      data.ambitions.map((name) => {
        return models.Ambition.findOrCreate({
          where: {name}, // pas de controle sur les ambitions comme : 'l'information' si on veut mettre au nom propre dans le domaine.
        }).then((model) => model[0]);
      })
    );
    modelCV.addAmbitions(ambitions);
  }

  // BusinessLines
  if (data.businessLines) {
    console.log(`createCV - BusinessLines`);
    const businessLines = await Promise.all(
      data.businessLines.map((name) => {
        return models.BusinessLine.findOrCreate({
          where: {name},
        }).then((model) => model[0]);
      })
    );
    modelCV.addBusinessLines(businessLines);
  }

  // Locations
  if (data.locations) {
    console.log(`createCV - Locations`);
    const locations = await Promise.all(
      data.locations.map((name) => {
        return models.Location.findOrCreate({
          where: {name},
        }).then((model) => model[0]);
      })
    );
    modelCV.addLocations(locations);
  }

  // Experiences
  if (data.experiences) {
    console.log(`createCV - Expériences`);
    const modelExperiences = await Promise.all(
      data.experiences.map(async (experience) => {
        const modelExperience = await models.Experience.create({
          CVId: modelCV.id,
          description: experience.description,
          order: experience.order
        });
        // Skills
        if (experience.skills) {
          console.log(`createCV - BusinessLines`);
          Promise.all(
            experience.skills.map((name) => {
              return models.Skill.findOrCreate({
                where: {name},
              }).then((model) => model[0]);
            })
          ).then((skills) => modelExperience.addSkills(skills));
        }
        return modelExperience;
      })
    );
  }

  // Reviews
  if (data.reviews) {
    console.log(`createCV - Reviews`);
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
    where: {id},
  });
};

// todo: revoir
const getCVbyUrl = async (url) => {
  console.log(`getCVbyUrl - Récupérer un CV ${url}`);
  const cvs = await sequelize.query(queryConditionCV('url', url), {
    type: QueryTypes.SELECT,
  });

  console.log(cvs);
  const modelCV = await models.CV.findByPk(cvs[0].id, {
    include: [...INCLUDES_COMPLETE_CV_WITHOUT_USER, INCLUDE_ALL_USERS],
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
      status: CV_STATUS.Published.value,
    },
    include: INCLUDES_COMPLETE_CV_WITH_NOT_HIDDEN_USER,
  });
  return modelCVs.map((modelCV) => cleanCV(modelCV));
};


const getRandomShortCVs = async (nb, query) => {
  console.log(
    `getRandomShortCVs - Récupère des CVs au format court de manière aléatoire`
  );

  const escapedQuery = escapeQuery(query);

  const cvs = await sequelize.query(`
    /* CV par recherche */

    select cv.id
    from
      "Users",
      "User_Candidats",

      /* pour chaque user, dernier CV publiés */
      "CVs" cv inner join
        (select "UserId", MAX(version) as version
          from "CVs"
          where "CVs".status = '${CV_STATUS.Published.value}'
          group by "UserId") groupCVs
        on cv."UserId" = groupCVs."UserId"
        and cv.version =  groupCVs.version

      /* jointure */
      where "Users"."id" = "User_Candidats"."candidatId"
      and "User_Candidats"."candidatId" = cv."UserId"

      /* CV visibles */
      and "User_Candidats".hidden = false

    ${query ? `
    /* recherche par toutes information du CV */
    and (
      cv."id" in (
        select distinct "CV_Ambitions"."CVId"
        FROM "CV_Ambitions" INNER JOIN "Ambitions"
        on "CV_Ambitions"."AmbitionId" = "Ambitions".id
        WHERE ${escapeColumn('"Ambitions"."name"')} like '%${escapedQuery}%'
      )
      or cv."id" in (
        select distinct "CV_BusinessLines"."CVId"
        FROM "CV_BusinessLines" INNER JOIN "BusinessLines"
        on "CV_BusinessLines"."BusinessLineId" = "BusinessLines".id
        where ${escapeColumn('"BusinessLines"."name"')} like '%${escapedQuery}%'
      )
      or cv."id" in (
        select distinct "CV_Contracts"."CVId"
        FROM "CV_Contracts" INNER JOIN "Contracts"
        on "CV_Contracts"."ContractId" = "Contracts".id
        where ${escapeColumn('"Contracts"."name"')} like '%${escapedQuery}%'
      )
      or cv."id" in (
        select distinct "CV_Languages"."CVId"
        FROM "CV_Languages" INNER JOIN "Languages"
        on "CV_Languages"."LanguageId" = "Languages".id
        where ${escapeColumn('"Languages"."name"')} like '%${escapedQuery}%'
      )
      or cv."id" in (
        select distinct "CV_Locations"."CVId"
        FROM "CV_Locations" INNER JOIN "Locations"
        on "CV_Locations"."LocationId" = "Locations".id
        where ${escapeColumn('"Locations"."name"')} like '%${escapedQuery}%'
      )
      or cv."id" in (
        select distinct "CV_Passions"."CVId"
        FROM "CV_Passions" INNER JOIN "Passions"
        on "CV_Passions"."PassionId" = "Passions".id
        where ${escapeColumn('"Passions"."name"')} like '%${escapedQuery}%'
      )
      or cv."id" in (
        select distinct "CV_Skills"."CVId"
        FROM "CV_Skills" INNER JOIN "Skills"
        on "CV_Skills"."SkillId" = "Skills".id
        where ${escapeColumn('"Skills"."name"')} like '%${escapedQuery}%'
      )
      or cv."id" in (
        select distinct exp."CVId"
        FROM "Experiences" exp
        where ${escapeColumn('exp."description"')} like '%${escapedQuery}%'
        or exp."id" in (
            select distinct "Experience_Skills"."ExperienceId"
            FROM "Experience_Skills" INNER JOIN "Skills"
            on "Experience_Skills"."SkillId" = "Skills".id
            where ${escapeColumn('"Skills"."name"')} like '%${escapedQuery}%'
        )
      )
      or cv."id" in (
          select distinct "Reviews"."CVId"
          FROM "Reviews"
          where ${escapeColumn('"Reviews"."name"')} like '%${escapedQuery}%'
          or ${escapeColumn('"Reviews"."text"')} like '%${escapedQuery}%'
          or ${escapeColumn('"Reviews"."status"')} like '%${escapedQuery}%'
      )
      or cv."id" in (
          select "CVs".id
          FROM "Users" INNER JOIN "CVs"
          on "CVs"."UserId" = "Users"."id"
          where (
            ${escapeColumn('"Users"."firstName"')} like '%${escapedQuery}%'
            or ${escapeColumn('"Users"."lastName"')} like '%${escapedQuery}%'
          )
      )
      or ${escapeColumn('cv."catchphrase"')} like '%${escapedQuery}%'
      or ${escapeColumn('cv."availability"')} like '%${escapedQuery}%'
      or ${escapeColumn('cv."story"')} like '%${escapedQuery}%'
      or ${escapeColumn('cv."transport"')} like '%${escapedQuery}%'
    )` : ''}`,
    {
      type: QueryTypes.SELECT,
    }
  );

  const modelCVs = await models.CV.findAll({
    where: {id: cvs.map((cv) => cv.id)},
    attributes: ['id', 'catchphrase', 'urlImg'],
    include: [
      {
        model: models.Ambition,
        as: 'ambitions',
        through: {attributes: []},
        attributes: ['name'],
      },
      {
        model: models.Skill,
        as: 'skills',
        through: {attributes: []},
        attributes: ['name'],
      },
      {
        model: models.BusinessLine,
        as: 'businessLines',
        through: {attributes: []},
        attributes: ['name'],
      },
      {
        model: models.Location,
        as: 'locations',
        through: {attributes: []},
        attributes: ['name'],
      },
      INCLUDE_ALL_USERS,
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
      where: {id},
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
