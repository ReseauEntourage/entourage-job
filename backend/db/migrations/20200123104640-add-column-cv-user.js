module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('Users', 'gender', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.removeColumn('CVs', 'firstName'),
      queryInterface.removeColumn('CVs', 'lastName'),
      queryInterface.addColumn('CVs', 'urlImg', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'catchphrase', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'devise', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'careerPath0', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'careerPath1', Sequelize.STRING),
      queryInterface.addColumn('CVs', 'careerPathOpen', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.changeColumn('Experiences', 'dateEnd', {
        allowNull: true,
        type: Sequelize.STRING,
      }),
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('Users', 'gender'),
      queryInterface.removeColumn('CVs', 'catchphrase'),
      queryInterface.removeColumn('CVs', 'devise'),
      queryInterface.removeColumn('CVs', 'careerPath0'),
      queryInterface.removeColumn('CVs', 'careerPath1'),
      queryInterface.removeColumn('CVs', 'careerPathOpen'),
      queryInterface.removeColumn('CVs', 'urlImg'),
      queryInterface.addColumn('CVs', 'firstName', {
        allowNull: false,
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('CVs', 'lastName', {
        allowNull: false,
        type: Sequelize.STRING,
      }),
    ]),
};
