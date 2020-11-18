module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addIndex('CV_Searches', ['CVId', 'searchString']),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeIndex('CV_Searches', ['CVId', 'searchString']),
    ]);
  },
};
