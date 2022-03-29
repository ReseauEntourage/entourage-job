import {
  CV_STATUS,
  JOBS,
  MAILJET_TEMPLATES,
  MEMBER_FILTERS_DATA,
  REDIS_KEYS,
  USER_ROLES,
} from 'src/constants';

import RedisManager from 'src/utils/RedisManager';
import * as S3 from 'src/controllers/Aws';

import { addToWorkQueue } from 'src/jobs';

import { getPublishedCVQuery } from 'src/controllers/CV';

import { Op, QueryTypes } from 'sequelize';

import uuid from 'uuid/v4';

import { models, sequelize } from 'src/db/models';
import { searchInColumnWhereOption } from 'src/utils/DatabaseQueries';
import {
  filterMembersByAssociatedUser,
  filterMembersByCVStatus,
  getMemberOptions,
  getFiltersObjectsFromQueryParams,
  filterMembersByBusinessLines,
} from 'src/utils/Filters';
import _ from 'lodash';
import * as AuthController from 'src/controllers/Auth';
import { getRelatedUser } from 'src/utils/Finding';

const { User, User_Candidat, CV, Opportunity_User, Revision, BusinessLine } =
  models;

const ATTRIBUTES_USER_CANDIDAT = [
  'employed',
  'hidden',
  'note',
  'url',
  'contract',
  'endOfContract',
];

const ATTRIBUTES_USER = [
  'id',
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'role',
  'adminRole',
  'zone',
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

const userSearchQuery = (query = '') => {
  return [
    searchInColumnWhereOption('User.email', query),
    searchInColumnWhereOption('User.firstName', query),
    searchInColumnWhereOption('User.lastName', query),
  ];
};

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

const sendMailsAfterMatching = async (candidatId) => {
  try {
    const finalCandidate = await getUser(candidatId);

    const toEmail = { to: finalCandidate.email };

    const coach = getRelatedUser(finalCandidate);
    if (coach) {
      toEmail.cc = coach.email;
    }

    await addToWorkQueue(
      {
        type: JOBS.JOB_TYPES.SEND_MAIL,
        toEmail,
        templateId: MAILJET_TEMPLATES.CV_PREPARE,
        variables: {
          ..._.omitBy(finalCandidate.toJSON(), _.isNil),
        },
      },
      {
        delay:
          (process.env.CV_START_DELAY
            ? parseFloat(process.env.CV_START_DELAY, 10)
            : 2) *
          3600000 *
          24,
      }
    );
    await addToWorkQueue(
      {
        type: JOBS.JOB_TYPES.REMINDER_CV_10,
        candidatId,
      },
      {
        delay:
          (process.env.CV_REMINDER_DELAY
            ? parseFloat(process.env.CV_REMINDER_DELAY, 10)
            : 10) *
          3600000 *
          24,
      }
    );
  } catch (err) {
    console.err(err);
  }
};

const createUser = async (newUser, userCreatedPassword) => {
  function fakePassword() {
    return Math.random() // Generate random number, eg: 0.123456
      .toString(36) // Convert  to base-36 : "0.4fzyo82mvyr"
      .slice(-8); // Cut off last 8 characters : "yo82mvyr"
  }

  const userPassword = userCreatedPassword || fakePassword();
  const { hash, salt } = AuthController.encryptPassword(userPassword);

  const infoLog = 'createUser -';
  console.log(`${infoLog} Création du User`);

  const userToCreate = { ...newUser, password: hash, salt };
  userToCreate.role = newUser.role || USER_ROLES.CANDIDAT;
  userToCreate.firstName = capitalizeName(userToCreate.firstName);
  userToCreate.lastName = capitalizeName(userToCreate.lastName);

  const createdUser = await User.create(userToCreate);

  const {
    password,
    salt: unusedSalt,
    revision,
    hashReset,
    saltReset,
    ...restProps
  } = createdUser.toJSON();

  await addToWorkQueue({
    type: JOBS.JOB_TYPES.SEND_MAIL,
    toEmail: newUser.email,
    templateId: MAILJET_TEMPLATES.ACCOUNT_CREATED,
    variables: {
      ..._.omitBy(restProps, _.isNil),
      password: userPassword,
    },
  });

  if (userToCreate.userToCoach) {
    if (createdUser.role === USER_ROLES.COACH) {
      await User_Candidat.update(
        { candidatId: userToCreate.userToCoach, coachId: createdUser.id },
        {
          where: { candidatId: userToCreate.userToCoach },
          individualHooks: true,
        }
      );
      await sendMailsAfterMatching(userToCreate.userToCoach);
    }
    if (createdUser.role === USER_ROLES.CANDIDAT) {
      await User_Candidat.update(
        { candidatId: createdUser.id, coachId: userToCreate.userToCoach },
        {
          where: { candidatId: createdUser.id },
          individualHooks: true,
        }
      );
      await sendMailsAfterMatching(createdUser.id);
    }
  }

  return createdUser;
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

const getMembers = async (params) => {
  const { limit, offset, order, role, query: search, ...restParams } = params;

  const filtersObj = getFiltersObjectsFromQueryParams(
    restParams,
    MEMBER_FILTERS_DATA
  );

  const { businessLines, cvStatus, associatedUser, ...restFilters } =
    filtersObj;

  console.log(restFilters);
  // The associatedUser options don't work that's why we take it out of the filters
  const filterOptions = getMemberOptions(restFilters);

  const options = {
    order,
    where: {
      role: { [Op.not]: USER_ROLES.ADMIN },
    },
    attributes: ATTRIBUTES_USER,
    include: INCLUDE_USER_CANDIDAT,
  };

  const hasFilterOptions = Object.keys(filtersObj).length > 0;

  if (!hasFilterOptions) {
    options.offset = offset;
    options.limit = limit;
  }
  // recherche de l'utilisateur
  if (search) {
    options.where = {
      ...options.where,
      [Op.or]: userSearchQuery(search),
    };
  }
  if (filterOptions.zone) {
    options.where = {
      ...options.where,
      zone: filterOptions.zone,
    };
  }

  // filtre par role
  if (role === USER_ROLES.CANDIDAT || role === USER_ROLES.COACH) {
    options.where = {
      ...options.where,
      role,
    };
  }

  const userCandidatOptions = {};
  if (
    (role === USER_ROLES.CANDIDAT || role === 'All') &&
    (filterOptions.hidden || filterOptions.employed)
  ) {
    userCandidatOptions.where = {};
    if (filterOptions.hidden) {
      userCandidatOptions.where = {
        ...userCandidatOptions.where,
        hidden: filterOptions.hidden,
      };
    }
    if (filterOptions.employed) {
      userCandidatOptions.where = {
        ...userCandidatOptions.where,
        employed: filterOptions.employed,
      };
    }
  }

  // TODO filter associated users in query
  /*
    if (filterOptions.associatedUser) {
      userCandidatOptions.where = {
        ...(userCandidatOptions.where || {}),
        ...filterOptions.associatedUser.candidat,
      };
    }
  */

  // recuperer la derniere version de cv
  options.include = [
    {
      model: User_Candidat,
      as: 'candidat',
      attributes: ['coachId', ...ATTRIBUTES_USER_CANDIDAT],
      ...userCandidatOptions,
      include: [
        {
          model: CV,
          as: 'cvs',
          attributes: ['version', 'status', 'urlImg'],
          include: [
            {
              model: BusinessLine,
              as: 'businessLines',
              attributes: ['name', 'order'],
              through: { attributes: [] },
            },
          ],
        },
        {
          model: User,
          as: 'coach',
          attributes: ATTRIBUTES_USER,
        },
      ],
      order: [['cvs.version', 'DESC']],
    },
    {
      model: User_Candidat,
      as: 'coach',
      attributes: ['candidatId', ...ATTRIBUTES_USER_CANDIDAT],
      include: [
        {
          model: User,
          as: 'candidat',
          attributes: ATTRIBUTES_USER,
        },
      ],
    },
  ];

  const members = await User.findAll(options);

  const filteredMembersByAssociatedUser = filterMembersByAssociatedUser(
    members,
    associatedUser
  );

  const membersWithLastCV = filteredMembersByAssociatedUser.map((member) => {
    const user = member.toJSON();
    if (user.candidat && user.candidat.cvs && user.candidat.cvs.length > 0) {
      const sortedCvs = user.candidat.cvs.sort((cv1, cv2) => {
        return cv2.version - cv1.version;
      });
      return {
        ...user,
        candidat: {
          ...user.candidat,
          cvs: [sortedCvs[0]],
        },
      };
    }
    return user;
  });

  let finalFilteredMembers = membersWithLastCV;

  if (role === USER_ROLES.CANDIDAT || role === 'All') {
    const filteredMembersByCVStatus = filterMembersByCVStatus(
      membersWithLastCV,
      cvStatus
    );
    finalFilteredMembers = filterMembersByBusinessLines(
      filteredMembersByCVStatus,
      businessLines
    );
  }

  if (hasFilterOptions && (offset || limit)) {
    if (offset && limit) {
      const intOffset = parseInt(offset, 10);
      const intLimit = parseInt(limit, 10);
      return finalFilteredMembers.slice(intOffset, intOffset + intLimit);
    }
    if (offset) {
      const intOffset = parseInt(offset, 10);
      return finalFilteredMembers.slice(intOffset);
    }
    if (limit) {
      const intLimit = parseInt(limit, 10);

      return finalFilteredMembers.slice(0, intLimit);
    }
  }
  return finalFilteredMembers;
};

const countSubmittedCVMembers = async (zone) => {
  const whereOptions = zone ? { zone } : {};

  const options = {
    where: {
      ...whereOptions,
      role: USER_ROLES.CANDIDAT,
    },
    attributes: ATTRIBUTES_USER,
    include: INCLUDE_USER_CANDIDAT,
  };

  // recuperer la derniere version de cv
  options.include = [
    {
      model: User_Candidat,
      as: 'candidat',
      attributes: ['coachId', ...ATTRIBUTES_USER_CANDIDAT],
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
      order: [['cvs.version', 'DESC']],
    },
  ];

  const members = await User.findAll(options);

  const membersWithLastCV = members.map((member) => {
    const user = member.toJSON();
    if (user.candidat && user.candidat.cvs && user.candidat.cvs.length > 0) {
      const sortedCvs = user.candidat.cvs.sort((cv1, cv2) => {
        return cv2.version - cv1.version;
      });
      return {
        ...user,
        candidat: {
          ...user.candidat,
          cvs: [sortedCvs[0]],
        },
      };
    }
    return user;
  });

  return {
    pendingCVs: filterMembersByCVStatus(membersWithLastCV, [
      { value: CV_STATUS.Pending.value },
    ]).length,
  };
};

const searchUsers = (query, role) => {
  const options = {
    attributes: ATTRIBUTES_USER,
    where: {
      [Op.or]: userSearchQuery(query),
    },
  };
  if (role) {
    options.where.role = role;
  }
  return User.findAll(options);
};

const searchCandidates = async (query) => {
  const publishedCVs = await sequelize.query(
    getPublishedCVQuery({ [Op.or]: [false] }),
    {
      type: QueryTypes.SELECT,
    }
  );
  const options = {
    attributes: ATTRIBUTES_USER_PUBLIC,
    where: {
      [Op.and]: [
        {
          id: publishedCVs.map((publishedCV) => {
            return publishedCV.UserId;
          }),
        },
        {
          [Op.or]: userSearchQuery(query),
        },
      ],
    },
  };
  return User.findAll(options);
};

const getAllPublishedCandidates = async () => {
  const publishedCVs = await sequelize.query(
    getPublishedCVQuery({ [Op.or]: [false] }),
    {
      type: QueryTypes.SELECT,
    }
  );

  const options = {
    attributes: ATTRIBUTES_USER,
    where: {
      [Op.and]: [
        {
          id: publishedCVs.map((publishedCV) => {
            return publishedCV.UserId;
          }),
        },
      ],
    },
    include: INCLUDE_USER_CANDIDAT,
  };
  return User.findAll(options);
};

const setUser = async (id, user) => {
  const [updateCount] = await User.update(user, {
    where: { id },
    individualHooks: true,
  });

  if (updateCount === 0) {
    return null;
  }

  return getUser(id);
};

const setUserCandidat = async (candidatId, candidat, userId) => {
  const prevUserCandidat = await User_Candidat.findByPk(candidatId);
  const userCandidat = await User_Candidat.update(
    {
      ...candidat,
      lastModifiedBy: userId,
    },
    {
      where: { candidatId },
      individualHooks: true,
    }
  ).then((model) => {
    return model && model.length > 1 && model[1][0];
  });

  if (candidat.coachId && userCandidat.coachId !== prevUserCandidat.coachId) {
    await sendMailsAfterMatching(userCandidat.candidatId);
  }

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

const setNoteHasBeenRead = async (candidatId, userId) => {
  const userCandidat = await User_Candidat.findByPk(candidatId);

  return User_Candidat.update(
    {
      lastModifiedBy:
        userCandidat.lastModifiedBy !== userId
          ? null
          : userCandidat.lastModifiedBy,
    },
    {
      where: { candidatId },
      individualHooks: true,
    }
  ).then((model) => {
    return model && model.length > 1 && model[1][0];
  });
};

const checkNoteHasBeenModified = async (candidatId, userId) => {
  const userCandidat = await User_Candidat.findOne({
    where: { candidatId },
    attributes: ['lastModifiedBy'],
  });

  return {
    noteHasBeenModified: userCandidat
      ? !!userCandidat.lastModifiedBy && userCandidat.lastModifiedBy !== userId
      : false,
  };
};

const getUserCandidatOpt = async ({ candidatId, coachId }) => {
  // pour eviter les erreurs du genre: UnhandledPromiseRejectionWarning: Error: WHERE parameter "coachId" has invalid "undefined" value
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
    individualHooks: true,
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

export {
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
  getUserCandidatOpt,
  getUserCandidats,
  getAllPublishedCandidates,
  countSubmittedCVMembers,
  checkNoteHasBeenModified,
  setNoteHasBeenRead,
  sendMailsAfterMatching,
};
