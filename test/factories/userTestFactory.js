const faker = require('faker');
const user = require('../../backend/db/models');
const { USER_ROLES } = require('../../constants');

/**
 * Generate an oject which contains the data necessary
 * to build a user.
 * @param {*} props Properties to use to create User
 * @return An object to build the user from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        email: faker.internet.email(),
        firstName: faker.firstName(),
        lastName: faker.lastName(),
        role: USER_ROLES.CANDIDAT,
        password: faker.password(),
        gender: faker.gender(),
        salt: faker.salt(),
        phone: faker.phone(),
        lastConnection: faker.date.past(),
    }
    return { ...defaultProps, ...props };
}

/**
 * Generate a User.
 * @param {*} props Properties to use to create User
 * @return a User
 */
export default async (props = {}) => user.create(await data(props));