module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.createTable('User_Candidats', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        candidatId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        coachId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        employed: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        hidden: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        note: {
          type: Sequelize.TEXT,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      queryInterface.removeColumn('Users', 'employed'),
      queryInterface.removeColumn('Users', 'hidden'),
      queryInterface.removeColumn('Users', 'userToCoach'),
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.dropTable('User_Candidats'),
      queryInterface.addColumn('Users', 'employed', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }),
      queryInterface.addColumn('Users', 'hidden', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      }),
      queryInterface.addColumn('Users', 'userToCoach', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      }),
    ]),
};
