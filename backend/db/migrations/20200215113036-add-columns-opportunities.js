module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('Opportunities', 'isValidated', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn('Opportunities', 'isArchived', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('Opportunities', 'isValidated'),
      queryInterface.removeColumn('Opportunities', 'isArchived'),
    ]),
};
