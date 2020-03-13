/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */

const {
  models: { User, User_Candidat, CV },
  Sequelize: { Op, fn, col, where },
} = require('../db/models');

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

const createUser = (newUser) => {
  const infoLog = 'createUser -';
  console.log(`${infoLog} Création du User`);

  const userToCreate = { ...newUser };
  userToCreate.role = newUser.role || 'Candidat';

  return User.create(userToCreate).then(async (res) => {
    if (userToCreate.userToCoach && res.role === 'Coach') {
      await User_Candidat.update(
        { candidatId: userToCreate.userToCoach, coachId: res.id },
        {
          where: { candidatId: userToCreate.userToCoach },
        }
      );
    }
    if (userToCreate.userToCoach && res.role === 'Candidat') {
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

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'deleteUser -';
    console.log(`${infoLog} Suppression d'un User à partir de son id`);
    User.destroy({
      where: { id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

// avec mot de passe
// Je narrive pas a recuperer candidat depuis l'id dun utilisateur coach
const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getUser -';
    console.log(`${infoLog} Récupérer un User à partir de son id`);
    User.findByPk(id, {
      attributes: ATTRIBUTES_USER,
      include: INCLUDE_USER_CANDIDAT,
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email },
    attributes: [...ATTRIBUTES_USER, 'salt', 'password'],
    include: [
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
    ],
  });
  return user;
};

const getUsers = (limit, offset, order) => {
  console.log(`getUsers - Récupérer les Users`);
  return User.findAll({
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
      role: { [Op.not]: 'Admin' },
    },
    attributes: ATTRIBUTES_USER,
    include: [
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
    ],
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
  if (role === 'Candidat' || role === 'Coach') {
    options.where = {
      ...options.where,
      role,
    };
  }
  // recuperer la derniere version de cv
  // todo trouver un moyen d'ameliorer la recuperation
  if (role === 'Candidat') {
    options.include = [
      {
        model: User_Candidat,
        as: 'candidat',
        attributes: ATTRIBUTES_USER_CANDIDAT,
        include: [
          {
            model: CV,
            as: 'cvs',
            attributes: ['version', 'status'],
          },
          {
            model: User,
            as: 'coach',
            attributes: ATTRIBUTES_USER,
          },
        ],
      },
    ];
  }
  if (role === 'Coach') {
    options.include = [
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
  }
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

const setUser = async (id, user) =>
  User.update(user, {
    where: { id },
  });

const setUserCandidat = async (candidatId, candidat) => {
  return User_Candidat.update(candidat, {
    where: { candidatId },
  });
};

const getUserCandidat = async (candidatId) => {
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

const getUserCandidats = async () => {
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
  getUserByEmail,
  getUsers,
  setUser,
  searchUsers,
  getMembers,
  setUserCandidat,
  getUserCandidat,
  getUserCandidatOpt,
  getUserCandidats,
};
