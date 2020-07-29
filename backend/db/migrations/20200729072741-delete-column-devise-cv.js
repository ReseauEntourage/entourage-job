module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('CVs', 'devise'),
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('CVs', 'devise', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      }),
    ]),
};
