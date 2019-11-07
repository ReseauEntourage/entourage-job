const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'CVs',
          'userId',
          {
            allowNull: false,
            type: Sequelize.UUID,
            defaultValue: uuid(),
          },
          {
            transaction: t,
          }
        ),
        queryInterface.addColumn(
          'CVs',
          'url',
          {
            allowNull: false,
            type: Sequelize.STRING,
            defaultValue: 'to-define',
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('CVs', 'userId', {
          transaction: t,
        }),
        queryInterface.removeColumn('CVs', 'url', {
          transaction: t,
        }),
      ]);
    });
  },
};