module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('CVs', 'devise');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('CVs', 'devise', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  }

};
