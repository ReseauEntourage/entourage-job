import { CV_STATUS } from 'src/constants';

export default {
  up: (queryInterface) => {
    return queryInterface.bulkUpdate(
      'CVs',
      {
        status: CV_STATUS.Published.value,
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
        status: CV_STATUS.Draft.value,
      },
      {
        version: 1,
      }
    );
  },
};
