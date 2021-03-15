module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Experiences', {
      fields: ['CVId'],
      type: 'foreign key',
      name: 'Experiences_CVId_fkey',
      references: {
        table: 'CVs',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      'Experiences',
      'Experiences_CVId_fkey'
    );
  },
};
