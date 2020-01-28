const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      CVId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'CVs',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: () => moment(new Date()),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: () => moment(new Date()),
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Reviews');
  },
};
