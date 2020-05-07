import {USER_ROLES} from "../../../constants";

module.exports = {
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
