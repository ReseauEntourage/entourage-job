/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */

const {
  models: { User, User_Candidat, CV },
  Sequelize: { Op, fn, col, where, and },
} = require('../db/models');

const getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email },
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'role',
      'lastConnection',
    ],
    include: [
      {
        model: User_Candidat,
        as: 'candidat',
        attributes: ['employed', 'hidden', 'note'],
        include: [
          {
            model: User,
            as: 'coach',
            attributes: [
              'id',
              'email',
              'firstName',
              'lastName',
              'email',
              'gender',
            ],
          },
          {
            model: User,
            as: 'candidat',
            attributes: [
              'id',
              'email',
              'firstName',
              'lastName',
              'email',
              'gender',
            ],
          },
        ],
      },
    ],
  });
  return user;
};

getUserByEmail('candidat@linkedout.fr')
  .then((_) => _.toJSON())
  .then(console.log);
