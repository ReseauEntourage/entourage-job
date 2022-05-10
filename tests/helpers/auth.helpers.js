import * as AuthController from 'src/controllers/Auth';
import * as UserController from 'src/controllers/User';

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
  const { hash, salt, jwtToken } = AuthController.generateRandomPasswordInJWT();

  try {
    updatedUser = await UserController.setUser(user.id, {
      hashReset: hash,
      saltReset: salt,
    });
  } catch (err) {
    if (!updatedUser) {
      throw Error('No user found');
    } else {
      throw Error(err);
    }
  }
  return {
    updatedUser: updatedUser.dataValues,
    token: jwtToken,
    link: `reset/${user.id}/${jwtToken}`,
  };
};

export default getResetLinkAndUser;
