const createLoggedInUser = require('./user.helpers');
const cvFactory = require('../factories/cvFactory');

/**
 * Create a cv and associated entities
 * 
 * @param {Object} cvData 
 * @param {Object<
            ambitions: number,
            contracts: number,
            languages: number,
            passions: number,
            buisnessLines: number,
            skills: number,
            experiences: number,
            reviews: number,
            candidat: boolean,
            >} 
* associations other models to be created and associated to the cv
* @returns a cv with desired associated entities, 
* @optional with associated user
*/
const createCvWithAssociations = async (props = {}) => {
  let fullCv = {};
  const associationsId = {};

  if (props.userId != null) {
    const newUser = await createLoggedInUser();
    fullCv.UserId = newUser.user.id;
  }

  fullCv = {
    ...fullCv,
    ...props,
  };
  const cv = await cvFactory(fullCv, associationsId, true);

  return {
    userId: fullCv.UserId,
    cv,
  };
};

module.exports = createCvWithAssociations;
