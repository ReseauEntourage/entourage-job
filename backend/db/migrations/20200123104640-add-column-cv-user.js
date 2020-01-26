module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('Users', 'gender', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.addColumn('CVs', 'catchphrase', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'devise', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'careerPath', Sequelize.STRING),
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('Users', 'gender'),
      queryInterface.removeColumn('CVs', 'catchphrase'),
      queryInterface.removeColumn('CVs', 'devise'),
      queryInterface.removeColumn('CVs', 'careerPath'),
    ]),
};
