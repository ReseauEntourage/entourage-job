module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('Users', 'deletedAt', {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn('CVs', 'deletedAt', {
        type: Sequelize.DATE,
      }),
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('Users', 'deletedAt'),
      queryInterface.removeColumn('CVs', 'deletedAt'),
    ]),
};
