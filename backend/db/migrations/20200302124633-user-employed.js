module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('Users', 'employed', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }),
    ]),

  down: (queryInterface, Sequelize) =>
    Promise.all([queryInterface.removeColumn('Users', 'employed')]),
};
