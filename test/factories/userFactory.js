const faker = require('faker');
const { USER_ROLES } = require('../../constants');
const {
  models: { User, User_Candidat },
} = require('../../backend/db/models');
const Auth = require('../../backend/controllers/Auth');

/**
 * Generate an oject which contains the data necessary
 * to build a user.
 * @param {Object} props Properties to use to create User
 * @return An object to build the user from.
 */
const generateUser = async (props = {}) => {
  const { salt, hash } = Auth.encryptPassword(
    props.password ? props.password : faker.internet.password()
  );

  return {
    id: faker.random.uuid(),
    email: props.email || faker.internet.email().toLowerCase(),
    firstName: props.firstName || faker.name.firstName(),
    lastName: props.lastName || faker.name.lastName(),
    role: props.role || faker.random.objectElement(USER_ROLES),
    password: hash,
    gender: props.gender || faker.random.arrayElement([0, 1]),
    salt,
    phone: props.phone || faker.phone.phoneNumber(),
    address: props.address || faker.address.streetAddress(),
    lastConnection: props.lastConnection || `${faker.date.past()}`,
    zone: props.zone || faker.address.county(),
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
    employed: props.employed || faker.random.boolean(),
    hidden: props.hidden || faker.random.boolean(),
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
    await User.create(userData);
    await User_Candidat.update(
      { ...userCandidatProps },
      {
        where: {
          candidatId: userData.id,
        },
      }
    );
    const userDb = await User.findOne({ where: { email: userData.email } });
    userData = userDb.dataValues;
  }
  return userData;
};

module.exports = userFactory;
