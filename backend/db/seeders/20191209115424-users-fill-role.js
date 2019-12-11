module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkUpdate(
      'Users',
      {
        role: 'Candidat',
      },
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkUpdate(
      'Users',
      [
        {
          role: null,
        },
      ],
      {}
    );
  },
};
