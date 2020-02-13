const { Op, fn, col, where } = require('sequelize');
const {
  models: { User, CV },
} = require('../db/models');

const createUser = (newUser) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'createUser -';
    console.log(`${infoLog} Création du User`);
    const userToCreate = { ...newUser };
    userToCreate.role = newUser.role || 'Candidat';
    User.create(userToCreate)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
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

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getUser -';
    console.log(`${infoLog} Récupérer un User à partir de son id`);
    User.findOne({
      where: { id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getUserByEmail -';
    console.log(`${infoLog} Récupérer un User à partir de son adresse email`);
    User.findOne({
      where: { email },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
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
    where: {},
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'role',
      'lastConnection',
    ],
    include: [
      {
        model: User,
        as: 'linkedUser',
        attributes: ['firstName', 'lastName'],
      },
    ],
  };
  // recherche de l'utilisateur
  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    options.where = {
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
    options.where.role = role;
    // recuperer la derniere version de cv
    // todo trouver un moyen d'ameliorer la recuperation
    if (role === 'Candidat') {
      options.include.push({
        model: CV,
        as: 'cvs',
        attributes: ['version', 'status'],
      });
      options.order = [[{ model: CV, as: 'cvs' }, 'version', 'desc']];
    }
  }
  return User.findAll(options);
};

const searchUsers = (query) => {
  const lowerCaseQuery = query.toLowerCase();
  return User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'email'],
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
  });
};

const setUser = (id, user) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'setUser -';
    console.log(`${infoLog} Modification du User`);
    User.update(user, {
      where: { id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
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
};
