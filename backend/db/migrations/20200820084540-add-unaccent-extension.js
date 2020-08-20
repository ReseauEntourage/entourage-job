module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION unaccent;')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP EXTENSION unaccent;')
  }
};
