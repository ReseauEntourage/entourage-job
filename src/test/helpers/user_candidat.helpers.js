import { getTokenAndId } from 'src/test/helpers/user.helpers';

import { models } from 'src/backend/db/models';

const { User_Candidat } = models;
/**
 * Associate a coach to a candidat
 *
 * @param {Object} coach the coach credentials
 * @param {string} coach.email the coach email
 * @param {string} coach.password the coach in unhashed
 * @param {Object} candidat the candidat credentials
 * @param {string} candidat.email the candidat email
 * @param {string} candidat.password the candidat in unhashed
 */
const associateCoachAndCandidat = async (coach, candidat, isLogged = false) => {
  const coachCredentials = isLogged ? coach : await getTokenAndId({ ...coach });
  const candidatCredentials = isLogged
    ? candidat
    : await getTokenAndId({ ...candidat });

  await User_Candidat.update(
    {
      candidatId: candidatCredentials.id,
      coachId: coachCredentials.id,
    },
    {
      where: { candidatId: candidatCredentials.id },
      individualHooks: true,
    }
  );
};

const getCandidatAndCoach = async (id) => {
  return User_Candidat.findOne({
    where: {
      candidatId: id,
    },
  });
};

/**
 * Get a candidat url from the table user_candidat
 *
 * @param {string} id of a user candidat
 * @returns {string} candidat's url
 */
const getCandidatUrl = async (id) => {
  const data = await User_Candidat.findOne({
    where: { candidatId: id },
    attributes: ['url'],
  });
  const { url } = data.dataValues;
  return url;
};

export { associateCoachAndCandidat, getCandidatAndCoach, getCandidatUrl };
