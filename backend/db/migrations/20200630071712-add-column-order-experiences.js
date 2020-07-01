'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('Experiences', 'order', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: -1,
      }),
    ]),
  down: (queryInterface, Sequelize) =>
      Promise.all([
        queryInterface.removeColumn('Experiences', 'order'),
      ]),
};
