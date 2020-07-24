const faker = require('faker');
const {
  models: {
    User
  },
} = require('../../backend/db/models');

const {
  USER_ROLES
} = require('../../constants');
const Auth = require('../../backend/controllers/Auth');

/**
 * Generate an oject which contains the data necessary
 * to build a user.
 * @param {Object} props Properties to use to create User
 * @return An object to build the user from.
 */
const data = async (props = {}) => {
  const {
    salt,
    hash
  } = Auth.encryptPassword(props.password ? props.password : faker.internet.password());

  return defaultProps = {
    email: props.email || faker.internet.email(),
    firstName: props.firstName || faker.name.firstName(),
    lastName: props.lastName || faker.name.lastName(),
    role: props.role || faker.random.objectElement(USER_ROLES),
    password: hash,
    gender: props.gender || faker.random.arrayElement([0, 1]),
    salt,
    phone: props.phone || faker.phone.phoneNumber(),
    lastConnection: props.lastConnection || faker.date.past(),
  };
}

/**
 * Create a User in DB.
 * @param {Object} props Properties to use to create User
 * @return Promise<User>
 */
const userFactory = async (props = {}, insertInDB = true) => {
  const userData = await data(props);

  if (insertInDB) {
    console.log('Creating user', userData.email, props.password);
    await User.create(userData);
  }

  return userData;
};

module.exports = userFactory;
