module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeConstraint(
          'CV_Ambitions',
          'CV_Ambitions_CVId_fkey',
          {
            transaction: t,
          }
        ),
        queryInterface.removeConstraint(
          'CV_Contracts',
          'CV_Contracts_CVId_fkey',
          {
            transaction: t,
          }
        ),
        queryInterface.removeConstraint(
          'CV_Languages',
          'CV_Languages_CVId_fkey',
          {
            transaction: t,
          }
        ),
        queryInterface.removeConstraint(
          'CV_Passions',
          'CV_Passions_CVId_fkey',
          {
            transaction: t,
          }
        ),
        queryInterface.removeConstraint('CV_Skills', 'CV_Skills_CVId_fkey', {
          transaction: t,
        }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addConstraint('CV_Ambitions', ['CVId'], {
          type: 'foreign key',
          name: 'CV_Ambitions_CVId_fkey',
          references: {
            table: 'CVs',
            field: 'id',
          },
        }),
        queryInterface.addConstraint('CV_Contracts', ['CVId'], {
          type: 'foreign key',
          name: 'CV_Contracts_CVId_fkey',
          references: {
            table: 'CVs',
            field: 'id',
          },
        }),
        queryInterface.addConstraint('CV_Languages', ['CVId'], {
          type: 'foreign key',
          name: 'CV_Languages_CVId_fkey',
          references: {
            table: 'CVs',
            field: 'id',
          },
        }),
        queryInterface.addConstraint('CV_Passions', ['CVId'], {
          type: 'foreign key',
          name: 'CV_Passions_CVId_fkey',
          references: {
            table: 'CVs',
            field: 'id',
          },
        }),
        queryInterface.addConstraint('CV_Skills', ['CVId'], {
          type: 'foreign key',
          name: 'CV_Skills_CVId_fkey',
          references: {
            table: 'CVs',
            field: 'id',
          },
        }),
      ]);
    });
  },
};
