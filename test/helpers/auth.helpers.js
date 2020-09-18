const AuthController = require('../../backend/controllers/Auth');
const UserController = require('../../backend/controllers/User');

/**
 * Get the reset link, updated user and associated token
 * 
 * @param {Object} user data
 * @param {string} user.id
 * @returns {Object} with three keys:
 * - updatedUser
 * - token
 * - link
 */
const getResetLinkAndUser = async (user) => {
    let updatedUser = null;
    const endDate = Date.now() + 1000 * 60 * 60 * 24;
    const token = AuthController.generateJWT(user, endDate);
    const {
        hash,
        salt
    } = AuthController.encryptPassword(token);

    try {
        updatedUser = await UserController.setUser(user.id, {
            hashReset: hash,
            saltReset: salt,
        });
    } catch (err) {
        if (!updatedUser) {
            throw Error('No user found');
        } else {
            throw Error(err)
        }
    }
    return {
        updatedUser: updatedUser.dataValues,
        token,
        link: `reset/${user.id}/${token}`,
    }
}

module.exports = getResetLinkAndUser