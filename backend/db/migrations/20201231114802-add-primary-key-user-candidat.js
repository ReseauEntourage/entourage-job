module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .removeConstraint('User_Candidats', 'User_Candidats_pkey')
      .then(() =>
        queryInterface
          .addColumn('User_Candidats', 'id', {
            type: Sequelize.UUID,
            unique: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
          })
          .then(() =>
            queryInterface.addConstraint('User_Candidats', {
              fields: ['id'],
              type: 'primary key',
              name: 'User_Candidats_pkey',
            })
          )
      ),
  down: (queryInterface, Sequelize) =>
    queryInterface
      .removeConstraint('User_Candidats', 'User_Candidats_pkey')
      .then(() =>
        queryInterface
          .addConstraint('User_Candidats', {
            fields: ['candidatId'],
            type: 'primary key',
            name: 'User_Candidats_pkey',
          })
          .then(() => queryInterface.removeColumn('User_Candidats', 'id'))
      ),
};
