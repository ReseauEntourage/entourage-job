const createLoggedInUser = require("./user.helpers");
const cvFactory = require("../factories/cvFactory");
const {
    models: {
        CV,
    }
} = require('../../backend/db/models');
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
        candidat: boolean,
    >
} associations other models to be created and associated to the cv
* @returns a cv with desired associated entities, 
* @optional with associated user
*/
const createCvWithAssociations = async (
    props = {},
    associations = {}
) => {
    let fullCv = {};
    const associationsId = {};

    if (props.userId != null) {
        const newUser = await createLoggedInUser();
        fullCv.UserId = newUser.user.id;
    } else {

    }
    // if (associations != null) {
    //     // eslint-disable-next-line guard-for-in
    //     for (const a in Object.keys(association)) {
    //         // eslint-disable-next-line guard-for-in
    //         const entities = await createEntities(window[`${a}Factory`], associations[a]);
    //         associationsId[a] = entities.map(e => e.id);
    //     }
    // }
    fullCv = {
        ...fullCv,
        ...props,
    }
    const cv = await cvFactory(fullCv, associationsId, true);

    return {
        userId: fullCv.UserId,
        cv
    }
}

module.exports = createCvWithAssociations