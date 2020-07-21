import User from '../../backend/db/models/user';

const faker = require('faker');
// const User = require('../../backend/db/models/user');
const { USER_ROLES } = require('../../constants');
const Auth = require('../../backend/controllers/Auth');

/**
 * Generate an oject which contains the data necessary
 * to build a user.
 * @param {*} props Properties to use to create User
 * @return An object to build the user from.
 */
const data = async (props = {}) => {
    const { salt, hash } = Auth.encryptPassword(faker.internet.password());
    const defaultProps = {
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        role: faker.random.objectElement(USER_ROLES),
        password: hash,
        gender: faker.random.arrayElement([0, 1]),
        salt,
        phone: faker.phone.phoneNumber(),
        lastConnection: faker.date.past(),
    }

    return { ...defaultProps, ...props };
}

/**
 * Create a User in DB.
 * @param {*} props Properties to use to create User
 * @return a User
 */
export default async (props = {}) => {
    const userData = await data(props);
    const user = await User.create(userData);

    return user;
};