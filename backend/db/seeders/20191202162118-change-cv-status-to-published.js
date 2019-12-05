

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkUpdate(
      'CVs',
      {
        status: 'Published',
      },
      {
        version: 1,
      }
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkUpdate(
      'CVs',
      {
        status: 'Draft',
      },
      {
        version: 1,
      }
    );
  },
};
