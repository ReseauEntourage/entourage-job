import { USER_ROLES } from 'src/constants';

import { encryptPassword } from 'src/controllers/Auth';

import faker from 'faker';

import { models } from 'src/db/models';
import { ADMIN_ZONES } from 'src/constants/departements';
import phone from 'phone';

const { User, User_Candidat } = models;

/**
 * Generate an oject which contains the data necessary
 * to build a user.
 * @param {Object} props Properties to use to create User
 * @return An object to build the user from.
 */
const generateUser = async (props = {}) => {
  const { salt, hash } = encryptPassword(
    props.password ? props.password : faker.internet.password()
  );

  return {
    id: faker.random.uuid(),
    email: props.email || faker.internet.email().toLowerCase(),
    firstName: props.firstName || faker.name.firstName(),
    lastName: props.lastName || faker.name.lastName(),
    role: props.role || USER_ROLES.CANDIDAT,
    password: hash,
    gender: props.gender || faker.random.arrayElement([0, 1]),
    salt,
    phone:
      props.phone ||
      phone(faker.phone.phoneNumber(), { country: 'USA' }).phoneNumber,
    address: props.address || faker.address.streetAddress(),
    lastConnection: props.lastConnection || `${faker.date.past()}`,
    zone: props.zone || ADMIN_ZONES.PARIS,
  };
};

/**
 * Generate an oject which contains the data necessary
 * to build a user.
 * @param {Object} props Properties to use to create User
 * @param {string} candidatId The userId to link to
 * @return An object to build the user from.
 */
// eslint-disable-next-line no-unused-vars
const generateUserCandidat = async (candidatId, props = {}) => {
  return {
    candidatId,
    coachId: props.coachId || null,
    employed: props.employed || false,
    hidden: props.hidden || false,
    url: 'test - url',
  };
};

/**
 * Create a User in DB.
 * @param {Object} props Properties to use to create User
 * @param {Object} userCandidatProps Properties to use to create UserCandidat association
 * @param {boolean} insertInDB @default true
 * @return {Promise<User>} a user model,
 * @optional if no DB insertion @returns generated user data
 */
const userFactory = async (
  props = {},
  userCandidatProps = {},
  insertInDB = true
) => {
  let userData = await generateUser(props);
  if (insertInDB) {
    await User.create(userData, { individualHooks: true });
    await User_Candidat.update(
      { ...userCandidatProps },
      {
        where: {
          candidatId: userData.id,
        },
        individualHooks: true,
      }
    );
    const userDb = await User.findOne({ where: { email: userData.email } });
    userData = userDb.dataValues;
  }
  return userData;
};

export default userFactory;
