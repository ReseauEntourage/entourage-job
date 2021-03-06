const { QueryTypes } = require('sequelize');

const uuid = require('uuid/v4');
const { USER_ROLES, REDIS_KEYS, JOBS, CV_STATUS } = require('../../constants');

const RedisManager = require('../utils/RedisManager');
const S3 = require('./Aws');

const { addToWorkQueue } = require('../jobs');

const {
  models: { User, User_Candidat, CV, Opportunity_User, Revision },
  Sequelize: { Op, fn, col, where },
  sequelize,
} = require('../db/models');

const { publishedCVQuery } = require('./CV');

const ATTRIBUTES_USER_CANDIDAT = ['employed', 'hidden', 'note', 'url'];
const ATTRIBUTES_USER = [
  'id',
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'role',
  'gender',
  'lastConnection',
  'deletedAt',
];

const ATTRIBUTES_USER_PUBLIC = ['id', 'firstName', 'lastName', 'role'];

const INCLUDE_USER_CANDIDAT = [
  {
    model: User_Candidat,
    as: 'candidat',
    attributes: ATTRIBUTES_USER_CANDIDAT,
    include: [
      {
        model: User,
        as: 'coach',
        attributes: ATTRIBUTES_USER,
        paranoid: false,
      },
    ],
  },
  {
    model: User_Candidat,
    as: 'coach',
    attributes: ATTRIBUTES_USER_CANDIDAT,
    include: [
      {
        model: User,
        as: 'candidat',
        attributes: ATTRIBUTES_USER,
        paranoid: false,
      },
    ],
  },
];

const capitalizeName = (name) => {
  let capitalizedName = name
    .toLowerCase()
    .split(' ')
    .map((s) => {
      return s.charAt(0).toUpperCase() + s.substring(1);
    })
    .join(' ');

  capitalizedName = capitalizedName
    .split('-')
    .map((s) => {
      return s.charAt(0).toUpperCase() + s.substring(1);
    })
    .join('-');

  return capitalizedName;
};

const createUser = async (newUser) => {
  const infoLog = 'createUser -';
  console.log(`${infoLog} Création du User`);

  const userToCreate = { ...newUser };
  userToCreate.role = newUser.role || USER_ROLES.CANDIDAT;
  userToCreate.firstName = capitalizeName(userToCreate.firstName);
  userToCreate.lastName = capitalizeName(userToCreate.lastName);

  return User.create(userToCreate).then(async (res) => {
    if (userToCreate.userToCoach && res.role === USER_ROLES.COACH) {
      await User_Candidat.update(
        { candidatId: userToCreate.userToCoach, coachId: res.id },
        {
          where: { candidatId: userToCreate.userToCoach },
        }
      );
    }
    if (userToCreate.userToCoach && res.role === USER_ROLES.CANDIDAT) {
      await User_Candidat.update(
        { candidatId: res.id, coachId: userToCreate.userToCoach },
        {
          where: { candidatId: res.id },
        }
      );
    }
    return res;
  });
};

// avec mot de passe
// Je narrive pas a recuperer candidat depuis l'id dun utilisateur coach
const getUser = async (id) => {
  const infoLog = 'getUser -';
  console.log(`${infoLog} Récupérer un User à partir de son id : ${id}`);
  return User.findByPk(id, {
    attributes: ATTRIBUTES_USER,
    include: INCLUDE_USER_CANDIDAT,
  });
};

const getCompleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getCompleteUser -';
    console.log(`${infoLog} Récupérer un User à partir de son id : ${id}`);
    User.findByPk(id, {
      include: INCLUDE_USER_CANDIDAT,
    })
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

const getUserByEmail = async (email) => {
  return User.findOne({
    where: { email: email.toLowerCase() },
    attributes: [...ATTRIBUTES_USER, 'salt', 'password'],
    include: INCLUDE_USER_CANDIDAT,
  });
};

const getUsers = (limit, offset, order) => {
  console.log(`getUsers - Récupérer les Users`);
  return User.findAll({
    attributes: ATTRIBUTES_USER,
    offset,
    limit,
    order,
  });
};

const getMembers = (limit, offset, order, role, query) => {
  const options = {
    offset,
    limit,
    order,
    where: {
      role: { [Op.not]: USER_ROLES.ADMIN },
    },
    attributes: ATTRIBUTES_USER,
    include: INCLUDE_USER_CANDIDAT,
  };
  // recherche de l'utilisateur
  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    options.where = {
      ...options.where,
      [Op.or]: [
        { email: { [Op.like]: `%${lowerCaseQuery}%` } },
        where(
          fn(
            'concat',
            fn('lower', col('User.firstName')),
            ' ',
            fn('lower', col('User.lastName'))
          ),
          { [Op.like]: `%${lowerCaseQuery}%` }
        ),
      ],
    };
  }

  // filtre par role
  if (role === USER_ROLES.CANDIDAT || role === USER_ROLES.COACH) {
    options.where = {
      ...options.where,
      role,
    };
  }

  // recuperer la derniere version de cv
  options.include = [
    {
      model: User_Candidat,
      as: 'candidat',
      attributes: ATTRIBUTES_USER_CANDIDAT,
      include: [
        {
          model: CV,
          as: 'cvs',
          attributes: ['version', 'status', 'urlImg'],
        },
        {
          model: User,
          as: 'coach',
          attributes: ATTRIBUTES_USER,
        },
      ],
    },
    {
      model: User_Candidat,
      as: 'coach',
      attributes: ATTRIBUTES_USER_CANDIDAT,
      include: [
        {
          model: User,
          as: 'candidat',
          attributes: ATTRIBUTES_USER,
        },
      ],
    },
  ];

  return User.findAll(options);
};

const searchUsers = (query, role) => {
  const lowerCaseQuery = query.toLowerCase();
  const options = {
    attributes: ATTRIBUTES_USER,
    where: {
      [Op.or]: [
        { email: { [Op.like]: `%${lowerCaseQuery}%` } },
        where(
          fn(
            'concat',
            fn('lower', col('firstName')),
            ' ',
            fn('lower', col('lastName'))
          ),
          { [Op.like]: `%${lowerCaseQuery}%` }
        ),
      ],
    },
  };
  if (role) {
    options.where.role = role;
  }
  return User.findAll(options);
};

const searchCandidates = async (query) => {
  const lowerCaseQuery = query.toLowerCase();
  const publishedCVs = await sequelize.query(publishedCVQuery, {
    type: QueryTypes.SELECT,
  });
  const filteredPublishedCVs = publishedCVs.filter((cv) => {
    return !cv.employed;
  });
  const options = {
    attributes: ATTRIBUTES_USER_PUBLIC,
    where: {
      [Op.and]: [
        {
          id: filteredPublishedCVs.map((publishedCV) => {
            return publishedCV.UserId;
          }),
        },
        where(
          fn(
            'concat',
            fn('lower', col('firstName')),
            ' ',
            fn('lower', col('lastName'))
          ),
          { [Op.like]: `%${lowerCaseQuery}%` }
        ),
      ],
    },
  };
  return User.findAll(options);
};

const setUser = async (id, user) => {
  const [updateCount] = await User.update(user, {
    where: { id },
    individualHooks: true,
  });

  if (updateCount === 0) return null;

  return getUser(id);
};

const setUserCandidat = async (candidatId, candidat) => {
  const userCandidat = await User_Candidat.update(candidat, {
    where: { candidatId },
    individualHooks: true,
  }).then((model) => {
    return model && model.length > 1 && model[1][0];
  });
  if (candidat.hidden) {
    await RedisManager.delAsync(REDIS_KEYS.CV_PREFIX + candidat.url);
  } else {
    await addToWorkQueue({
      type: JOBS.JOB_TYPES.CACHE_CV,
      candidatId,
    });
  }
  await addToWorkQueue({
    type: JOBS.JOB_TYPES.CACHE_ALL_CVS,
  });
  return userCandidat;
};

const getUserCandidat = (candidatId) => {
  return User_Candidat.findOne({
    where: { candidatId },
    attributes: ATTRIBUTES_USER_CANDIDAT,
    include: [
      {
        model: User,
        as: 'coach',
        attributes: ATTRIBUTES_USER,
      },
      {
        model: User,
        as: 'candidat',
        attributes: ATTRIBUTES_USER,
      },
    ],
  });
};

const getUserCandidatOpt = async ({ candidatId, coachId }) => {
  // pour eviter les errurs du genre: UnhandledPromiseRejectionWarning: Error: WHERE parameter "coachId" has invalid "undefined" value
  const findWhere = {};
  if (candidatId) {
    findWhere.candidatId = candidatId;
  }
  if (coachId) {
    findWhere.coachId = coachId;
  }
  return User_Candidat.findOne({
    where: findWhere,
    attributes: ATTRIBUTES_USER_CANDIDAT,
    include: [
      {
        model: User,
        as: 'coach',
        attributes: ATTRIBUTES_USER,
      },
      {
        model: User,
        as: 'candidat',
        attributes: ATTRIBUTES_USER,
      },
    ],
  });
};

const generateImageNamesToDelete = (prefix) => {
  const imageNames = Object.keys(CV_STATUS).map((status) => {
    return [`${prefix}.${status}.jpg`, `${prefix}.${status}.preview.jpg`];
  });

  return imageNames.reduce((acc, curr) => {
    return [...acc, ...curr];
  }, []);
};

const deleteUser = async (id) => {
  const infoLog = 'deleteUser -';

  const user = await getUser(id);

  if (!user) {
    return;
  }

  console.log(`${infoLog} Deleting image and PDF for user `, id);

  await S3.deleteFiles(
    generateImageNamesToDelete(`${process.env.AWSS3_IMAGE_DIRECTORY}${id}`)
  );
  const pdfFileName = `${user.firstName}_${user.lastName}_${id.substring(
    0,
    8
  )}.pdf`;
  await S3.deleteFiles(`${process.env.AWSS3_FILE_DIRECTORY}${pdfFileName}`);

  console.log(`${infoLog} Deleting cache for user `, id);
  if (user.role === USER_ROLES.CANDIDAT) {
    await RedisManager.delAsync(REDIS_KEYS.CV_PREFIX + user.candidat.url);
  }

  console.log(`${infoLog} Anonymization of user's data `, id);

  await user.update({
    firstName: 'Utilisateur',
    lastName: 'supprimé',
    email: `${Date.now()}@${uuid()}.deleted`,
    phone: null,
    address: null,
  });

  await User_Candidat.update(
    {
      note: null,
      url: `deleted-${id.substring(0, 8)}`,
    },
    {
      where: {
        candidatId: id,
      },
    }
  );

  const userOpportunitiesQuery = {
    where: {
      UserId: id,
    },
  };

  const userOpportunities = await Opportunity_User.findAll(
    userOpportunitiesQuery
  );

  await Opportunity_User.update(
    {
      note: null,
    },
    userOpportunitiesQuery
  );

  await CV.update(
    {
      intro: null,
      story: null,
      transport: null,
      availability: null,
      urlImg: null,
      catchphrase: null,
    },
    {
      where: {
        UserId: id,
      },
    }
  );

  const revisionsQuery = {
    where: {
      [Op.or]: [
        { documentId: id },
        {
          documentId: userOpportunities.map((userOpp) => {
            return userOpp.id;
          }),
        },
      ],
    },
  };

  const revisions = await Revision.findAll(revisionsQuery);

  // Have to use raw query because Revision_Change is not declared as a model
  await sequelize.query(
    `
    UPDATE "RevisionChanges"
    SET "document" = '{}'::jsonb, "diff" = '[{}]'::jsonb
    WHERE "revisionId" IN (${revisions.map((revision) => {
      return `'${revision.id}'`;
    })});
  `,
    {
      type: QueryTypes.UPDATE,
    }
  );

  await Revision.update(
    {
      document: {},
    },
    revisionsQuery
  );

  console.log(`${infoLog} Soft deletion of associated CVs`, id);
  const cvsDeleted = await CV.destroy({
    where: { UserId: id },
    individualHooks: true,
  });

  console.log(`${infoLog} Soft deletion of user`, id);
  const usersDeleted = await User.destroy({
    where: { id },
  });

  await addToWorkQueue({
    type: JOBS.JOB_TYPES.CACHE_ALL_CVS,
  });

  return { usersDeleted, cvsDeleted };
};

const getUserCandidats = () => {
  return User_Candidat.findAll({
    attributes: ATTRIBUTES_USER_CANDIDAT,
    include: [
      {
        model: User,
        as: 'coach',
        attributes: ATTRIBUTES_USER,
      },
      {
        model: User,
        as: 'candidat',
        attributes: ATTRIBUTES_USER,
      },
    ],
  });
};

module.exports = {
  createUser,
  deleteUser,
  getUser,
  getCompleteUser,
  getUserByEmail,
  getUsers,
  setUser,
  searchUsers,
  searchCandidates,
  getMembers,
  setUserCandidat,
  getUserCandidat,
  getUserCandidatOpt,
  getUserCandidats,
};
