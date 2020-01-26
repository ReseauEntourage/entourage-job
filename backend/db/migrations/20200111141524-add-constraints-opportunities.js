module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addConstraint('Opportunities_Users', ['OpportunityId'], {
          type: 'foreign key',
          name: 'Opportunities_Users_OpportunitiesId_fkey',
          references: {
            table: 'Opportunities',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
          transaction: t,
        }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint(
          'Opportunities_Users',
          'Opportunities_Users_OpportunitiesId_fkey',
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
