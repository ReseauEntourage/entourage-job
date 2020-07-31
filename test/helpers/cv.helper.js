const { default: next } = require("next");
const { createEntities } = require("./helpers");
const createLoggedInUser = require("./user.helper");
const cvFactory = require("../factories/cvFactory");
/**
 * Create a cv and associated entities
 * 
 * @param {Object} cvData 
 * @param {
 *  Object<
        ambitions: number,
        contracts: number,
        languages: number,
        passions: number,
        buisnessLines: number,
        skills: number,
        experiences: number,
        reviews: number,
        candidatId: boolean,
    >
} associations other models to be created and associated to the cv
* @returns a cv with desired associated entities, 
* @optional with associated user
*/
const createCvWithAssociations = async (
    cvData = {},
    associations = {}
) => {
    const associationsId = {};
    let user;
    if (associations.candidatId) {
        user = await createLoggedInUser();
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const a in Object.keys(associations)) {
        if (associations[a] != null) {
            if (a === 'candidatId') {
                associationsId[a] = user.user.id
                next();
            }
            const entities = await createEntities(window[`${a}Factory`], associations[a]);
            associationsId[a] = entities.map(e => e.id);
        }
    }
    const cv = await cvFactory({
        ...cvData,
        ...associationsId
    });

    return {
        user,
        cv
    }
}

module.exports = {
    createCvWithAssociations,
}