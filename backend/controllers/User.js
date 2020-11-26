const { QueryTypes } = require('sequelize');
const Queue = require('bull');

const {USER_ROLES, REDIS_KEYS, WORKER_TYPES} = require("../../constants");

const RedisManager = require('../utils/RedisManager');

const workQueue = new Queue('work', process.env.REDIS_URL);

const {
  models: {User, User_Candidat, Share, CV},
  Sequelize: {Op, fn, col, where},
  sequelize
} = require('../db/models');

const {publishedCVQuery} = require('./CV');


const ATTRIBUTES_USER_CANDIDAT = ['employed', 'hidden', 'note', 'url'];
const ATTRIBUTES_USER = [
  'id',
  'firstName',
  'lastName',
  'email',
  'phone',
  'role',
  'gender',
  'lastConnection',
];

const ATTRIBUTES_USER_PUBLIC = [
  'id',
  'firstName',
  'lastName',
  'role',
];

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

const capitalizeName = (name) => {
  let capitalizedName = name.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

  capitalizedName = capitalizedName
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join('-');

  return capitalizedName;
};

const createUser = async (newUser) => {
  const infoLog = 'createUser -';
  console.log(`${infoLog} Création du User`);

  const userToCreate = {...newUser};
  userToCreate.role = newUser.role || USER_ROLES.CANDIDAT;
  userToCreate.firstName = capitalizeName(userToCreate.firstName);
  userToCreate.lastName = capitalizeName(userToCreate.lastName);

  return User.create(userToCreate).then(async (res) => {
    if (userToCreate.userToCoach && res.role === USER_ROLES.COACH) {
      await User_Candidat.update(
        {candidatId: userToCreate.userToCoach, coachId: res.id},
        {
          where: {candidatId: userToCreate.userToCoach},
        }
      );
    }
    if (userToCreate.userToCoach && res.role === USER_ROLES.CANDIDAT) {
      await User_Candidat.update(
        {candidatId: res.id, coachId: userToCreate.userToCoach},
        {
          where: {candidatId: res.id},
        }
      );
    }
    return res;
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'deleteUser -';
    console.log(`${infoLog} Suppression d'un User à partir de son id`);
    User.destroy({
      where: {id},
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
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
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: {email: email.toLowerCase()},
    attributes: [...ATTRIBUTES_USER, 'salt', 'password'],
    include: INCLUDE_USER_CANDIDAT,
  });

  return user;
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
      role: {[Op.not]: USER_ROLES.ADMIN},
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
        {email: {[Op.like]: `%${lowerCaseQuery}%`}},
        where(
          fn(
            'concat',
            fn('lower', col('User.firstName')),
            ' ',
            fn('lower', col('User.lastName'))
          ),
          {[Op.like]: `%${lowerCaseQuery}%`}
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
    }
  ];

  return User.findAll(options);
};

const searchUsers = (query, role) => {
  const lowerCaseQuery = query.toLowerCase();
  const options = {
    attributes: ATTRIBUTES_USER,
    where: {
      [Op.or]: [
        {email: {[Op.like]: `%${lowerCaseQuery}%`}},
        where(
          fn(
            'concat',
            fn('lower', col('firstName')),
            ' ',
            fn('lower', col('lastName'))
          ),
          {[Op.like]: `%${lowerCaseQuery}%`}
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
  const options = {
    attributes: ATTRIBUTES_USER_PUBLIC,
    where: {
      [Op.and]: [
        { id: publishedCVs.map((publishedCV) => publishedCV.UserId) },
        where(
          fn(
            'concat',
            fn('lower', col('firstName')),
            ' ',
            fn('lower', col('lastName'))
          ),
          {[Op.like]: `%${lowerCaseQuery}%`}
        ),
      ],
    },
  };
  return User.findAll(options);
};

const setUser = async (id, user) => {
  const [updateCount] = await User.update(user, {
    where: {id},
    individualHooks: true
  });

  if (updateCount === 0) return null;

  return getUser(id);
};

const setUserCandidat = async (candidatId, candidat) => {
  if (candidat.hidden) {
    await RedisManager.delAsync(REDIS_KEYS.CV_PREFIX + candidat.url);
  }
  else {
    await workQueue.add({
      type: WORKER_TYPES.CACHE_CV,
      url: candidat.url,
    });
  }
  return User_Candidat.update(candidat, {
    where: { candidatId },
    individualHooks: true,
  });
};

const getUserCandidat = (candidatId) => {
  return User_Candidat.findOne({
    where: {candidatId},
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

const getUserCandidatOpt = async ({candidatId, coachId}) => {
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
