module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('RevisionChanges', 'RevisionId', {
      allowNull: true,
      type: Sequelize.UUID,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('RevisionChanges', 'RevisionId');
  },
};
