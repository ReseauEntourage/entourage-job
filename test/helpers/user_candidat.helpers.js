const {
    models: {
        User,
        User_Candidat,
    }
} = require('../../backend/db/models/');

/**
 * Associate a coach to a candidat
 * 
 * @param {string} coachId 
 * @param {string} candidatId 
 */
const associateCoachAndCandidat = async (coachId, candidatId) => {
    await User_Candidat.update(
        {
            candidatId,
            coachId
        },
        {
            where: { candidatId }
        });
    await User.update(
        {
            coachId,
            candidatId
        },
        {
            where: { id: coachId }
        }
    )
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

module.exports = associateCoachAndCandidat;