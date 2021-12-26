import { USER_ROLES } from 'src/constants';

export default {
  up: (queryInterface) => {
    return queryInterface.bulkUpdate(
      'Users',
      {
        role: USER_ROLES.CANDIDAT,
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
