module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Shares', 'other', {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Shares', 'other');
  }
};
