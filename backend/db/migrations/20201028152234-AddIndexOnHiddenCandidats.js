'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addIndex('User_Candidats', ['hidden']),
      queryInterface.addIndex('CVs', ['version', 'UserId']),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeIndex('User_Candidats', ['hidden']),
      queryInterface.removeIndex('CVs', ['version', 'UserId']),
    ]);
  },
};
