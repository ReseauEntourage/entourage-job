'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CV_Skills', [{
      id: uuid(),
      CVid: "61e6e010-e3fb-44a9-a3bf-ab7f8a1c29fb",
      name: "à l'écoute",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      CVid: "61e6e010-e3fb-44a9-a3bf-ab7f8a1c29fb",
      name: "emphatique",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      CVid: "61e6e010-e3fb-44a9-a3bf-ab7f8a1c29fb",
      name: "sociable",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      CVid: "61e6e010-e3fb-44a9-a3bf-ab7f8a1c29fb",
      name: "optimiste",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      CVid: "61e6e010-e3fb-44a9-a3bf-ab7f8a1c29fb",
      name: "ponctuelle",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      CVid: "61e6e010-e3fb-44a9-a3bf-ab7f8a1c29fb",
      name: "motivée",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      CVid: "750c0197-0f37-4a96-b70a-16f9c9787ff3",
      name: "Inventif",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      CVid: "750c0197-0f37-4a96-b70a-16f9c9787ff3",
      name: "cultivé",
      createdAt: new Date(),
      updatedAt: new Date()
    },], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CV_Skills', null, {});
  }
};
