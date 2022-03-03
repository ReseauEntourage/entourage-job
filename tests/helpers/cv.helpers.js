import cvFactory from 'tests/factories/cvFactory';
import { createLoggedInUser } from 'tests/helpers/user.helpers';

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
            locations: number,
            skills: number,
            experiences: number,
            reviews: number,
            candidat: boolean,
            >}
 * associations other models to be created and associated to the cv
 * @returns a cv with desired associated entities,
 * @optional with associated user
 */
const createCvWithAssociations = async (props = {}, components = {}) => {
  let fullCv = {};

  if (props.userId != null) {
    const newUser = await createLoggedInUser();
    fullCv.UserId = newUser.user.id;
  }

  fullCv = {
    ...fullCv,
    ...props,
  };
  const cv = await cvFactory(fullCv, components, true);

  return {
    userId: fullCv.UserId,
    cv,
  };
};

export default createCvWithAssociations;
