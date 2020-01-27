module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('Users', 'gender', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.addColumn('CVs', 'gender', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('CVs', 'catchphrase', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'devise', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'careerPath0', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'careerPath1', Sequelize.STRING),
      queryInterface.removeColumn('CVs', 'careerPathOpen', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }),
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('Users', 'gender'),
      queryInterface.removeColumn('CVs', 'gender'),
      queryInterface.removeColumn('CVs', 'catchphrase'),
      queryInterface.removeColumn('CVs', 'devise'),
      queryInterface.removeColumn('CVs', 'careerPath0'),
      queryInterface.removeColumn('CVs', 'careerPath1'),
      queryInterface.removeColumn('CVs', 'careerPathOpen'),
    ]),
};
