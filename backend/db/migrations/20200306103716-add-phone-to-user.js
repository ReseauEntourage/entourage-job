module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('Users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]),

  down: (queryInterface, Sequelize) =>
    Promise.all([queryInterface.removeColumn('Users', 'phone')]),
};
