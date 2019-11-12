const sequelize = require('sequelize');
const db = require('../db/config/databaseConnect');
const User = require('../db/models/user')(db, sequelize.DataTypes);

const createUser = ({ req }) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'createUser -';
    console.log(`${infoLog} Création du User`);
    User.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      role: req.body.role,
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const deleteUser = ({ req }) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'deleteUser -';
    console.log(`${infoLog} Suppression d'un User à partir de son id`);
    User.destroy({
      where: { id: req.params.id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getUser = ({ req }) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getUser -';
    console.log(`${infoLog} Récupérer un User à partir de son id`);
    User.findOne({
      where: { id: req.params.id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getUserByEmail = ({ req }) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getUserByEmail -';
    console.log(`${infoLog} Récupérer un User à partir de son adresse email`);
    User.findOne({
      where: { email: req.params.email },
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

module.exports = { createUser, deleteUser, getUser, getUserByEmail, getUsers };
