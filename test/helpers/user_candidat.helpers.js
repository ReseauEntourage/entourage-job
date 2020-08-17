const {
    models: {
        User,
        User_Candidat,
    }
} = require('../../backend/db/models/');

const { getTokenAndId } = require('./user.helpers');

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
const associateCoachAndCandidat = async (coach, candidat) => {
    const coachCredentials = await getTokenAndId({ ...coach });
    const candidatCredentials = await getTokenAndId({ ...candidat });

    await User_Candidat.update(
        {
            candidatId: candidatCredentials.id,
            coachId: coachCredentials.id
        },
        {
            where: { candidatId: candidatCredentials.id }
        });

    await User.update(
        {
            coachId: coachCredentials.id,
            candidatId: candidatCredentials.id
        },
        {
            where: { id: coachCredentials.id }
        }
    );
}

const getCandidatAndCoach = async (id) => {
    return User_Candidat.findOne(
        {
            where: {
                candidatId: id,
            }
        }
    );
}

// /**
//  * Get a candidat url from the table user_candidat
//  * 
//  * @param {string} id of a user candidat
//  */
// const getCandidatUrl = async (id) => {
//     const user = await User_Candidat.findOne({
//         where: { candidatId: id },
//         attributes: ['url']
//     });
//     return user;
// }

module.exports = {
    associateCoachAndCandidat,
    getCandidatAndCoach,
};