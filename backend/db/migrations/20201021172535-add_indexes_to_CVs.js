'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addIndex('CVs', ['UserId']),
      queryInterface.addIndex('CVs', ['status', 'UserId']),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeIndex('CVs', ['UserId']),
      queryInterface.removeIndex('CVs', ['status', 'UserId']),
    ]);
  },
};
