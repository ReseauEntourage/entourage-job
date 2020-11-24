const { QueryTypes } = require('sequelize');
const fs = require('fs');
const puppeteer = require('puppeteer');
const PDFMerger = require('pdf-merger-js');
const S3 = require('../controllers/aws');

const RedisManager = require('../utils/RedisManager');

const { INITIAL_NB_OF_CV_TO_DISPLAY } = require('../../constants');

const {
  models,
  sequelize,
  // Sequelize: { Op, fn, col, where },
} = require('../db/models');

const { cleanCV, escapeColumn, escapeQuery } = require('../utils');

const { CV_STATUS, REDIS_KEYS } = require('../../constants');

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

const INCLUDE_ALL_USERS_PRIVATE = {
  model: models.User_Candidat,
  as: 'user',
  attributes: ['employed', 'hidden', 'url'],
  include: [
    {
      model: models.User,
      as: 'coach',
      attributes: ['id', 'firstName', 'lastName', 'gender', 'email', 'phone'],
    },
    {
      model: models.User,
      as: 'candidat',
      attributes: ['id', 'firstName', 'lastName', 'gender', 'email', 'phone'],
    },
  ],
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
    model: models.BusinessLine,
    as: 'businessLines',
    through: { attributes: [] },
    attributes: ['id', 'name'],
  },
  {
    model: models.Location,
    as: 'locations',
    through: { attributes: [] },
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
        through: { attributes: [] },
        attributes: ['id', 'name'],
      },
    ],
    order: [['order', 'ASC']],
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

const INCLUDES_COMPLETE_CV_WITH_ALL_USER_PRIVATE = [
  ...INCLUDES_COMPLETE_CV_WITHOUT_USER,
  INCLUDE_ALL_USERS_PRIVATE,
];

const publishedCVQuery = `
    /* CV par recherche */

    with groupCVs as (	select
      /* pour chaque user, dernier CV publiés */
        "UserId", MAX(version) as version
      from
        "User_Candidats",
        "CVs"
      where
        "CVs".status = '${CV_STATUS.Published.value}'
        and "User_Candidats"."candidatId" = "CVs"."UserId"
        and "User_Candidats".hidden = false
      group by
        "UserId")
    select
      cvs.id, cvs."UserId"
    from
      "CVs" cvs
    inner join groupCVs on
      cvs."UserId" = groupCVs."UserId" and cvs.version = groupCVs.version`;

const dividedCompleteCVQuery = async (query, privateUser) => {
  const completeIncludes = privateUser
    ? INCLUDES_COMPLETE_CV_WITH_ALL_USER_PRIVATE
    : INCLUDES_COMPLETE_CV_WITH_ALL_USER;

  const results = await Promise.all(
    completeIncludes.map(async (include) => query(include))
  );

  return results.reduce((acc, curr) => {
    const cleanedCurr = cleanCV(curr);
    return {
      ...acc,
      ...cleanedCurr,
    };
  }, {});
};

// permet de recuperer les id de cv recherchés pour ensuite fetch ses données
const queryConditionCV = (attribute, value, allowHidden) => `
  SELECT cvs.id
  FROM "CVs" cvs
  inner join (
    select "UserId", MAX(version) as version
    from "CVs"
    where "CVs".status = '${CV_STATUS.Published.value}'
    group by "UserId") groupCVs
  on cvs."UserId" = groupCVs."UserId"
  and cvs.version =  groupCVs.version
  and cvs.status = '${CV_STATUS.Published.value}'
  inner join (
    select distinct "candidatId"
    from "User_Candidats"
    where ${allowHidden ? '' : ` hidden = false `}
    ${attribute && value && !allowHidden ? ' and ' : ''}
    ${attribute && value ? ` ${attribute} = '${value}'` : ''}) groupUsers
  on cvs."UserId" = groupUsers."candidatId"`;

const createCV = async (data) => {
  console.log(`createCV - Création du CV`);
  if (data.userId) {
    data.UserId = data.userId;
    delete data.userId;
  }

  const maxVersions = await models.CV.findAll({
    attributes: [[sequelize.fn('MAX', sequelize.col('version')), 'maxVersion']],
    raw: true,
    where: {
      UserId: data.UserId,
    },
  });

  const cvData = {
    ...data,
    version: maxVersions[0].maxVersion + 1,
  };

  const modelCV = await models.CV.create(cvData); // TODO VERIFIER LES ENTREES

  const promises = [];

  // Skills
  if (cvData.skills) {
    promises.push(async () => {
      console.log(`createCV - Skills`);
      const skills = await Promise.all(
        // pour chaque competence
        cvData.skills.map((name) => {
          // on trouve ou créé la donné
          return (
            models.Skill.findOrCreate({
              where: { name },
            })
              // on recupere de model retourné
              .then((model) => model[0])
          );
        })
      );
      // on ajoute toutes les competences
      await modelCV.addSkills(skills);
    });
  }

  // languages
  if (cvData.languages) {
    promises.push(async () => {
      console.log(`createCV - Langues`);
      const languages = await Promise.all(
        // pour chaque competence
        cvData.languages.map((name) => {
          // on trouve ou créé la donné
          return models.Language.findOrCreate({
            where: { name },
            // on recupere de model retourné
          }).then((model) => model[0]);
        })
      );
      // on ajoute toutes les competences
      await modelCV.addLanguages(languages);
    });
  }

  // Contracts
  if (cvData.contracts) {
    promises.push(async () => {
      console.log(`createCV - Contrats`);
      const contracts = await Promise.all(
        cvData.contracts.map((name) => {
          return models.Contract.findOrCreate({
            where: { name },
          }).then((model) => model[0]);
        })
      );
      await modelCV.addContracts(contracts);
    });
  }

  // Passions
  if (cvData.passions) {
    promises.push(async () => {
      console.log(`createCV - Passions`);
      const passions = await Promise.all(
        cvData.passions.map((name) => {
          return models.Passion.findOrCreate({
            where: { name },
          }).then((model) => model[0]);
        })
      );
      await modelCV.addPassions(passions);
    });
  }

  // Ambitions
  if (cvData.ambitions) {
    promises.push(async () => {
      console.log(`createCV - Ambitions`);
      const ambitions = await Promise.all(
        cvData.ambitions.map((name) => {
          return models.Ambition.findOrCreate({
            where: { name }, // pas de controle sur les ambitions comme : 'l'information' si on veut mettre au nom propre dans le domaine.
          }).then((model) => model[0]);
        })
      );
      await modelCV.addAmbitions(ambitions);
    });
  }

  // BusinessLines
  if (cvData.businessLines) {
    promises.push(async () => {
      console.log(`createCV - BusinessLines`);
      const businessLines = await Promise.all(
        cvData.businessLines.map((name) => {
          return models.BusinessLine.findOrCreate({
            where: { name },
          }).then((model) => model[0]);
        })
      );
      await modelCV.addBusinessLines(businessLines);
    });
  }

  // Locations
  if (cvData.locations) {
    promises.push(async () => {
      console.log(`createCV - Locations`);
      const locations = await Promise.all(
        cvData.locations.map((name) => {
          return models.Location.findOrCreate({
            where: { name },
          }).then((model) => model[0]);
        })
      );
      await modelCV.addLocations(locations);
    });
  }

  // Experiences
  if (cvData.experiences) {
    promises.push(async () => {
      console.log(`createCV - Expériences`);
      const experiences = await Promise.all(
        cvData.experiences.map(async (experience) => {
          const modelExperience = await models.Experience.create({
            CVId: modelCV.id,
            description: experience.description,
            order: experience.order,
          });
          // Skills
          if (experience.skills) {
            console.log(`createCV - Experience Skills`);
            const skills = await Promise.all(
              experience.skills.map((name) => {
                return models.Skill.findOrCreate({
                  where: { name },
                }).then((model) => model[0]);
              })
            );
            await modelExperience.addSkills(skills);
          }
          return modelExperience;
        })
      );
    });
  }

  // Reviews
  if (cvData.reviews) {
    promises.push(async () => {
      console.log(`createCV - Reviews`);
      const reviews = await Promise.all(
        cvData.reviews.map(async (review) =>
          models.Review.create({
            CVId: modelCV.id,
            text: review.text,
            status: review.status,
            name: review.name,
          })
        )
      );
    });
  }

  await Promise.all(promises.map(async (promise) => promise()));

  // renvoie du cv complet
  console.log(`createCV - Etape finale - Reprendre le CV complet à retourner`);

  return dividedCompleteCVQuery(async (include) =>
    models.CV.findByPk(modelCV.id, {
      exclude: ['UserId'],
      include: [include],
    })
  );
};

const deleteCV = (id) => {
  console.log(`deleteCV - Suppression d'un CV à partir de son id`);
  return models.CV.destroy({
    where: { id },
  });
};

const getAndCacheCV = async (url) => {
  const redisKey = REDIS_KEYS.CV_PREFIX + url;

  let cv;

  const cvs = await sequelize.query(
    queryConditionCV('url', url.replace("'", "''")),
    {
      type: QueryTypes.SELECT,
    }
  );

  if (cvs && cvs.length > 0) {
    cv = await dividedCompleteCVQuery(async (include) =>
      models.CV.findByPk(cvs[0].id, {
        include: [include],
      })
    );

    await RedisManager.setAsync(
      redisKey,
      JSON.stringify(cv),
    );
  }

  return cv;
};

const getCVbyUrl = async (url) => {
  console.log(`getCVbyUrl - Récupérer un CV ${url}`);

  const redisKey = REDIS_KEYS.CV_PREFIX + url;
  const redisCV = await RedisManager.getAsync(redisKey);

  let cv;

  if (redisCV) {
    cv = JSON.parse(redisCV);
  } else {
    const cvs = await sequelize.query(
      queryConditionCV('url', url.replace("'", "''")),
      {
        type: QueryTypes.SELECT,
      }
    );

    if (cvs && cvs.length > 0) {
      cv = await getAndCacheCV(url);
    }
  }

  return cv;
};

// todo: revoir
const getCVbyUserId = async (userId) => {
  console.log(`getCVByUserId ${userId}`);

  const user = await models.User.findByPk(userId);

  if (user) {
    return dividedCompleteCVQuery(
      async (include) =>
        models.CV.findOne({
          include: [include],
          where: {
            UserId: userId,
          },
          order: [['version', 'DESC']],
        }),
      true
    );
  }

  return null;
};

// TODO Delete if not used
const getCVs = async () => {
  console.log(`getCVs - Récupérer les CVs`);
  // TODO change for better performance if you ever need to use it
  const modelCVs = await models.CV.findAll({
    where: {
      status: CV_STATUS.Published.value,
    },
    include: INCLUDES_COMPLETE_CV_WITH_NOT_HIDDEN_USER,
  });
  return modelCVs.map((modelCV) => cleanCV(modelCV));
};

const getRandomShortCVs = async (nb, query) => {
  const escapedQuery = escapeQuery(query);

  console.log(
    `getRandomShortCVs - Récupère des CVs au format court de manière aléatoire ${
      escapedQuery ? `pour "${escapedQuery}"` : ''
    }`
  );

  const getAllCvs = async (dbQuery) => {
    const cvs = await sequelize.query(dbQuery, {
      type: QueryTypes.SELECT,
    });

    const cvList = await models.CV.findAll({
      where: {
        id: cvs.map((cv) => cv.id),
      },
      attributes: ['id', 'catchphrase', 'urlImg'],
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
          model: models.BusinessLine,
          as: 'businessLines',
          through: { attributes: [] },
          attributes: ['name'],
        },
        {
          model: models.Location,
          as: 'locations',
          through: { attributes: [] },
          attributes: ['name'],
        },
        INCLUDE_ALL_USERS,
      ],
    });

    return cvList.map(cleanCV);
  };

  let modelCVs;

  if (!escapedQuery) {
    const redisKey = REDIS_KEYS.CV_LIST;
    const redisCvs = await RedisManager.getAsync(redisKey);

    if (redisCvs) {
      modelCVs = JSON.parse(redisCvs);
    } else {
      modelCVs = await getAllCvs(publishedCVQuery);

      await RedisManager.setWithExpireAsync(
        redisKey,
        JSON.stringify(modelCVs),
        60 * 10
      );
    }
  } else {
    modelCVs = await getAllCvs(`
      with publishedCVs as (${publishedCVQuery})
      SELECT cvSearches."CVId" as id
      FROM "CV_Searches" cvSearches
        INNER JOIN publishedCVs on cvSearches."CVId" = publishedCVs."id"
        WHERE ${escapeColumn(
          'cvSearches."searchString"'
        )} like '%${escapedQuery}%'
    `);
  }

  const totalSharesPerUser = await sequelize.query(
    `
      select shares."CandidatId", (SUM(facebook) + SUM(linkedin) + SUM(twitter) + SUM(whatsapp)) as totalshares
      from "Shares" shares
      GROUP BY shares."CandidatId";
    `,
    {
      type: QueryTypes.SELECT,
    }
  );

  const totalShares = totalSharesPerUser.reduce((acc, curr) => {
    return acc + parseInt(curr.totalshares, 10);
  }, 0);

  let finalCVList = modelCVs.map((modelCV) => {
    const cv = modelCV;
    const totalSharesForUser = totalSharesPerUser.find(
      (shares) => shares.CandidatId === cv.user.candidat.id
    );
    cv.ranking = 0;
    if (totalSharesForUser) {
      cv.ranking = totalSharesForUser.totalshares / totalShares;
    }
    if (cv.user.employed) {
      cv.ranking = 1;
    }
    return cv;
  });

  finalCVList = finalCVList
    .sort(() => Math.random() - 0.5)
    .slice(0, nb) // shuffle and take the nb first
    .sort((a, b) => a.ranking - b.ranking); // then order reverse by ranking

  if (!nb || nb > INITIAL_NB_OF_CV_TO_DISPLAY) {
    finalCVList = [
      ...finalCVList.slice(0, INITIAL_NB_OF_CV_TO_DISPLAY),
      ...finalCVList
        .slice(INITIAL_NB_OF_CV_TO_DISPLAY, nb)
        .sort(() => Math.random() - 0.5),
    ];
  }

  return finalCVList;
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

const generatePDF = async (userId, token, paths) => {
  const s3Key = `${process.env.AWSS3_FILE_DIRECTORY}${paths[2]}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const merger = new PDFMerger();

  const options = {
    content: '@page { size: A4 portrait; margin: 0; }',
  };

  // Fix because can't create page break
  await page.goto(
    `${process.env.SERVER_URL}/cv/pdf/${userId}?token=${token}&page=0`,
    { waitUntil: 'networkidle2' }
  );
  await page.addStyleTag(options);
  await page.emulateMediaType('screen');
  await page.pdf({
    path: paths[0],
    preferCSSPageSize: true,
    printBackground: true,
  });
  merger.add(paths[0]);

  await page.goto(
    `${process.env.SERVER_URL}/cv/pdf/${userId}?token=${token}&page=1`,
    { waitUntil: 'networkidle2' }
  );
  await page.addStyleTag(options);
  await page.emulateMediaType('screen');
  await page.pdf({
    path: paths[1],
    preferCSSPageSize: true,
    printBackground: true,
  });
  merger.add(paths[1]);

  await browser.close();

  await merger.save(paths[2]);

  const pdfBuffer = fs.readFileSync(paths[2]);

  await S3.upload(pdfBuffer, 'application/pdf', `${paths[2]}`, true);

  return S3.getSignedUrl(s3Key);
};

const createSearchString = async (cv) => {
  const searchString = [
    cv.ambitions.join(' '),
    cv.businessLines.join(' '),
    cv.contracts.join(' '),
    cv.languages.join(' '),
    cv.locations.join(' '),
    cv.passions.join(' '),
    cv.skills.join(' '),
    cv.transport,
    cv.story,
    cv.availability,
    cv.catchphrase,
    cv.user.candidat.firstName,
    cv.user.candidat.lastName,
    cv.experiences
      .map((exp) => [exp.description, exp.skills.join(' ')].join(' '))
      .join(' '),
    cv.reviews
      .map((reviews) => [reviews.text, reviews.status, reviews.name].join(' '))
      .join(' '),
  ].join(' ');

  await models.CV_Search.create({
    CVId: cv.id,
    searchString,
  });

  return searchString;
};

module.exports = {
  createCV,
  deleteCV,
  getCVbyUrl,
  getCVbyUserId,
  getCVs,
  getRandomShortCVs,
  setCV,
  createSearchString,
  generatePDF,
  getAndCacheCV,
  publishedCVQuery,
};
