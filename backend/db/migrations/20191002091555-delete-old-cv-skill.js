const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.dropTable('CV_Skills');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CV_Skills', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: () => {
          return uuid();
        },
      },
      CVid: {
        allowNull: false,
        references: {
          model: 'CVs',
          key: 'id',
        },
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
};
