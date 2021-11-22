import {
  cleanCV,
  escapeColumnRaw,
  escapeQuery,
  forceGC,
} from 'src/backend/utils';
import * as S3 from 'src/backend/controllers/Aws';
import RedisManager from 'src/backend/utils/RedisManager';

import { CV_FILTERS_DATA, CV_STATUS, REDIS_KEYS } from 'src/constants';

import { models, sequelize } from 'src/backend/db/models';

import {
  getCVOptions,
  getFiltersObjectsFromQueryParams,
} from 'src/backend/utils/Filters';

import _ from 'lodash';

import { col, fn, Op, QueryTypes } from 'sequelize';
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
import moment from 'moment';

const INCLUDE_ALL_USERS = {
  model: models.User_Candidat,
  as: 'user',
  attributes: ['employed', 'hidden', 'url', 'endOfContract'],
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
      attributes: ['id', 'firstName', 'lastName', 'gender', 'email'],
    },
    {
      model: models.User,
      as: 'candidat',
      attributes: [
        'id',
        'firstName',
        'lastName',
        'gender',
        'email',
        'phone',
        'address',
        'zone',
      ],
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

const getPublishedCVQuery = (employed) => {
  return `
    /* CV par recherche */

    with groupCVs as (	select
      /* pour chaque user, dernier CV publiés */
        "UserId", MAX(version) as version, "employed"
      from
        "User_Candidats",
        "CVs"
      where
        "CVs".status = '${CV_STATUS.Published.value}'
        and "CVs"."deletedAt" IS NULL
        and "User_Candidats"."candidatId" = "CVs"."UserId"
        and "User_Candidats".hidden = false
       ${
         employed && employed[Op.or]
           ? `and (${employed[Op.or].map((value, index) => {
               return `${
                 index > 0 ? 'or ' : ''
               }"User_Candidats".employed = ${value}`;
             })})`
           : ''
       }
      group by
        "UserId", "employed")
    select
      cvs.id, cvs."UserId", groupCVs."employed"
    from
      "CVs" cvs
    inner join groupCVs on
      cvs."UserId" = groupCVs."UserId" and cvs.version = groupCVs.version`;
};

const dividedCompleteCVQuery = async (query, privateUser) => {
  const completeIncludes = privateUser
    ? INCLUDES_COMPLETE_CV_WITH_ALL_USER_PRIVATE
    : INCLUDES_COMPLETE_CV_WITH_ALL_USER;

  const results = await Promise.all(
    completeIncludes.map(async (include) => {
      return query(include);
    })
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
const queryConditionCV = (attribute, value, allowHidden) => {
  return `
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
  and cvs."deletedAt" IS NULL
  inner join (
    select distinct "candidatId"
    from "User_Candidats"
    where ${allowHidden ? '' : ` hidden = false `}
    ${attribute && value && !allowHidden ? ' and ' : ''}
    ${attribute && value ? ` ${attribute} = '${value}'` : ''}) groupUsers
  on cvs."UserId" = groupUsers."candidatId"`;
};

const createCV = async (data, userId) => {
  console.log(`createCV - Création du CV`);
  if (data.userId) {
    data.UserId = data.userId;
    delete data.userId;
  }

  const maxVersions = await models.CV.findAll({
    attributes: [[fn('MAX', col('version')), 'maxVersion']],
    raw: true,
    where: {
      UserId: data.UserId,
    },
  });

  const cvData = {
    ...data,
    version: maxVersions[0].maxVersion + 1,
    lastModifiedBy: userId,
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
              .then((model) => {
                return model[0];
              })
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
          }).then((model) => {
            return model[0];
          });
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
          }).then((model) => {
            return model[0];
          });
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
          }).then((model) => {
            return model[0];
          });
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
          }).then((model) => {
            return model[0];
          });
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
          }).then((model) => {
            return model[0];
          });
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
          }).then((model) => {
            return model[0];
          });
        })
      );
      await modelCV.addLocations(locations);
    });
  }

  // Experiences
  if (cvData.experiences) {
    promises.push(async () => {
      console.log(`createCV - Expériences`);
      await Promise.all(
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
                }).then((model) => {
                  return model[0];
                });
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
      await Promise.all(
        cvData.reviews.map(async (review) => {
          return models.Review.create({
            CVId: modelCV.id,
            text: review.text,
            status: review.status,
            name: review.name,
          });
        })
      );
    });
  }

  await Promise.all(
    promises.map(async (promise) => {
      return promise();
    })
  );

  // renvoie du cv complet
  console.log(`createCV - Etape finale - Reprendre le CV complet à retourner`);

  return dividedCompleteCVQuery(async (include) => {
    return models.CV.findByPk(modelCV.id, {
      exclude: ['UserId'],
      include: [include],
    });
  }, true);
};

const deleteCV = (id) => {
  console.log(`deleteCV - Suppression d'un CV à partir de son id`);
  return models.CV.destroy({
    where: { id },
  });
};

const getAndCacheCV = async (url, candidatId) => {
  let urlToUse = url;

  if (!urlToUse && candidatId) {
    const userCandidat = await models.User_Candidat.findOne({
      where: {
        candidatId,
      },
      attributes: ['url'],
    });
    urlToUse = userCandidat.url;
  }

  const redisKey = REDIS_KEYS.CV_PREFIX + urlToUse;

  let cv;

  const cvs = await sequelize.query(
    queryConditionCV('url', urlToUse.replace("'", "''")),
    {
      type: QueryTypes.SELECT,
    }
  );

  if (cvs && cvs.length > 0) {
    cv = await dividedCompleteCVQuery(async (include) => {
      return models.CV.findByPk(cvs[0].id, {
        include: [include],
      });
    });

    await RedisManager.setAsync(redisKey, JSON.stringify(cv));
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
    cv = await getAndCacheCV(url);
  }

  const userCandidat = await models.User_Candidat.findOne({
    where: {
      url,
    },
  });

  const cvResponse = {
    cv,
    exists: cv ? true : !!userCandidat,
  };
  return cvResponse;
};

// todo: revoir
const getCVbyUserId = async (userId) => {
  console.log(`getCVByUserId ${userId}`);

  const user = await models.User.findByPk(userId);

  if (user) {
    return dividedCompleteCVQuery(async (include) => {
      return models.CV.findOne({
        include: [include],
        where: {
          UserId: userId,
        },
        order: [['version', 'DESC']],
      });
    }, true);
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
  return modelCVs.map((modelCV) => {
    return cleanCV(modelCV);
  });
};

const getAndCacheAllCVs = async (dbQuery, cache, options = {}) => {
  const { employed, ...restOptions } = options;

  const cvs = await sequelize.query(dbQuery || getPublishedCVQuery(employed), {
    type: QueryTypes.SELECT,
  });

  const cvList = await models.CV.findAll({
    where: {
      id: cvs.map((cv) => {
        return cv.id;
      }),
    },
    attributes: ['id', 'catchphrase', 'urlImg', 'updatedAt'],
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
        where: restOptions.businessLines
          ? {
              name: restOptions.businessLines,
            }
          : undefined,
      },
      {
        model: models.Location,
        as: 'locations',
        through: { attributes: [] },
        attributes: ['name'],
        where: restOptions.locations
          ? {
              name: restOptions.locations,
            }
          : undefined,
      },
      INCLUDE_ALL_USERS,
    ],
  });

  const cleanedCVList = cvList.map(cleanCV);

  if (cache) {
    await RedisManager.setAsync(
      REDIS_KEYS.CV_LIST,
      JSON.stringify(cleanedCVList)
    );
  }

  return cleanedCVList;
};

const getRandomShortCVs = async (nb, query, params) => {
  const escapedQuery = escapeQuery(query);

  console.log(
    `getRandomShortCVs - Récupère des CVs au format court de manière aléatoire ${
      escapedQuery ? `pour "${escapedQuery}"` : ''
    }`
  );

  const filtersObj = getFiltersObjectsFromQueryParams(params, CV_FILTERS_DATA);

  let modelCVs;
  let hasSuggestions = false;
  const options = getCVOptions(filtersObj);

  if (!escapedQuery && Object.keys(options).length === 0) {
    const redisKey = REDIS_KEYS.CV_LIST;
    const redisCvs = await RedisManager.getAsync(redisKey);

    if (redisCvs) {
      modelCVs = JSON.parse(redisCvs);
    } else {
      modelCVs = await getAndCacheAllCVs(getPublishedCVQuery(), true);
    }
  } else {
    const { employed, ...restOptions } = options;
    const dbQuery = escapedQuery
      ? `
      with publishedCVs as (${getPublishedCVQuery(employed)})
      SELECT cvSearches."CVId" as id
      FROM "CV_Searches" cvSearches
        INNER JOIN publishedCVs on cvSearches."CVId" = publishedCVs."id"
        WHERE ${escapeColumnRaw(
          'cvSearches."searchString"'
        )} like '%${escapedQuery}%'
    `
      : undefined;
    modelCVs = await getAndCacheAllCVs(
      dbQuery,
      false,
      dbQuery ? restOptions : options
    );

    if (modelCVs.length <= 0) {
      if (
        filtersObj &&
        filtersObj[CV_FILTERS_DATA[1].key] &&
        filtersObj[CV_FILTERS_DATA[1].key].length > 0
      ) {
        if (
          filtersObj[CV_FILTERS_DATA[2].key] &&
          filtersObj[CV_FILTERS_DATA[2].key].length > 0
        ) {
          const newFiltersObj = {
            ...filtersObj,
            [CV_FILTERS_DATA[2].key]: [],
          };
          const newOptions = getCVOptions(newFiltersObj);

          const { employed: newEmployed, ...newRestOptions } = newOptions;

          const filteredOtherCvs = await getAndCacheAllCVs(
            dbQuery,
            false,
            dbQuery ? newRestOptions : newOptions
          );
          if (filteredOtherCvs && filteredOtherCvs.length > 0) {
            modelCVs = filteredOtherCvs;
            hasSuggestions = true;
          }
        }
      }
    }
  }

  const totalSharesPerUser = await sequelize.query(
    `
      select shares."CandidatId", (SUM(facebook) + SUM(linkedin) + SUM(twitter) + SUM(whatsapp) + SUM(other)) as totalshares
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

  const finalCVList = modelCVs.map((modelCV) => {
    const cv = modelCV;
    const totalSharesForUser = totalSharesPerUser.find((shares) => {
      return shares.CandidatId === cv.user.candidat.id;
    });
    cv.ranking = 0;
    if (totalSharesForUser) {
      cv.ranking = totalSharesForUser.totalshares / totalShares;
    }
    return cv;
  });

  const groupedCVsByMonth = _.groupBy(finalCVList, (cv) => {
    return moment(cv.updatedAt).startOf('month').format('YYYY/MM');
  });

  const sortedGroupedCvsByMonth = _.mapValues(groupedCVsByMonth, (arr) => {
    return arr
      .sort(() => {
        return Math.random() - 0.5;
      })
      .sort((a, b) => {
        return a.ranking - b.ranking; // then order reverse by ranking
      });
  });

  const sortedKeys = Object.keys(sortedGroupedCvsByMonth).sort(
    (date1, date2) => {
      return moment(date2, 'YYYY/MM').diff(moment(date1, 'YYYY/MM'));
    }
  );

  return {
    cvs: sortedKeys
      .reduce((acc, curr) => {
        return [...acc, ...sortedGroupedCvsByMonth[curr]];
      }, [])
      .slice(0, nb),
    suggestions: hasSuggestions,
  };
};

const setCV = (id, cv) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'setCV -';
    console.log(`${infoLog} Modification du CV`);
    models.CV.update(cv, {
      where: { id },
    })
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

const generatePdfFromCV = async (userId, token, paths) => {
  const s3Key = `${process.env.AWSS3_FILE_DIRECTORY}${paths[2]}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    executablePath: process.env.CHROME_PATH,
  });
  const page = await browser.newPage();

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

  await page.close();

  await browser.close();

  const mergedPdf = await PDFDocument.create();

  const pdfA = await PDFDocument.load(fs.readFileSync(paths[0]));
  const pdfB = await PDFDocument.load(fs.readFileSync(paths[1]));

  const copiedPagesA = await mergedPdf.copyPages(pdfA, pdfA.getPageIndices());
  copiedPagesA.forEach((pdfPage) => {
    return mergedPdf.addPage(pdfPage);
  });

  const copiedPagesB = await mergedPdf.copyPages(pdfB, pdfB.getPageIndices());
  copiedPagesB.forEach((pdfPage) => {
    return mergedPdf.addPage(pdfPage);
  });

  const mergedPdfFile = await mergedPdf.save();

  const pdfBuffer = Buffer.from(mergedPdfFile);

  await S3.upload(pdfBuffer, 'application/pdf', `${paths[2]}`, true);

  if (fs.existsSync(paths[0])) fs.unlinkSync(paths[0]);
  if (fs.existsSync(paths[1])) fs.unlinkSync(paths[1]);
  if (fs.existsSync(paths[2])) fs.unlinkSync(paths[2]);

  forceGC();

  return S3.getSignedUrl(s3Key);
};

const createSearchString = async (userId) => {
  const cv = await getCVbyUserId(userId);
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
      .map((exp) => {
        return [exp.description, exp.skills.join(' ')].join(' ');
      })
      .join(' '),
    cv.reviews
      .map((reviews) => {
        return [reviews.text, reviews.status, reviews.name].join(' ');
      })
      .join(' '),
  ].join(' ');

  await models.CV_Search.create({
    CVId: cv.id,
    searchString,
  });

  return searchString;
};

const setCVHasBeenRead = async (candidatId, userId) => {
  const cv = await models.CV.findOne({
    where: {
      UserId: candidatId,
    },
    order: [['version', 'DESC']],
  });

  if (cv) {
    return models.CV.update(
      {
        lastModifiedBy: cv.lastModifiedBy !== userId ? null : cv.lastModifiedBy,
      },
      {
        where: { id: cv.id },
        individualHooks: true,
      }
    ).then((model) => {
      return model && model.length > 1 && model[1][0];
    });
  }

  return null;
};

const checkCVHasBeenModified = async (candidatId, userId) => {
  const cv = await models.CV.findOne({
    where: {
      UserId: candidatId,
    },
    order: [['version', 'DESC']],
  });

  return {
    cvHasBeenModified: cv
      ? !!cv.lastModifiedBy && cv.lastModifiedBy !== userId
      : false,
  };
};

export {
  createCV,
  deleteCV,
  getCVbyUrl,
  getCVbyUserId,
  getCVs,
  getRandomShortCVs,
  setCV,
  createSearchString,
  generatePdfFromCV,
  getAndCacheCV,
  getAndCacheAllCVs,
  getPublishedCVQuery,
  checkCVHasBeenModified,
  setCVHasBeenRead,
};
