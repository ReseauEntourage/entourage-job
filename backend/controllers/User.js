const sequelize = require('sequelize');
const db = require('../db/config/databaseConnect');
const User = require('../db/models/user')(db, sequelize.DataTypes);

const createUser = (newUser) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'createUser -';
    console.log(`${infoLog} Création du User`);
    User.create({
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      password: newUser.password,
      role: newUser.role,
      salt: 'test',
    })
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

const getUsers = () => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getUsers -';
    console.log(`${infoLog} Récupérer les Users`);
    User.findAll()
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const setUser = (id, user) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'setUser -';
    console.log(`${infoLog} Modification du User`);
    User.update(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      {
        where: { id },
        fields: ['email', 'firstName', 'lastName'],
      }
    )
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
};
