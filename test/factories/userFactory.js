const faker = require('faker');
const User = require('../../backend/db/models/user');
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
        role: faker.random.objectElement(USER_ROLES),
        password: faker.password(),
        gender: faker.gender(),
        salt: faker.salt(),
        phone: faker.phone(),
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
    let userData;
    try {
        userData = await data(props);
    } catch (e) {
        throw new Error(`Error while creating User data: ${e}`);
    }
    try {
        User.create(userData);
    } catch (e) {
        throw new Error(`Error while inserting User in DB: ${e}`);
    }
    return userData;
};