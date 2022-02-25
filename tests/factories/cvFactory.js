import { CV_STATUS } from 'src/constants';

import { models } from 'src/db/models';

import fakerStatic from 'faker';
import uuid from 'uuid/v4';
import _ from 'lodash';

/**
 * Extract cv status values from CV_STATUS constant
 *
 * @param {Object} cvStatus : CV_STATUS constant
 * @retrn array of status values
 */
const getCvStatusValues = (cvStatus) => {
  return Object.keys(cvStatus).map((status) => {
    return cvStatus[status].value;
  });
};

/**
 * Generate data to create a CV
 *
 * @param {Object} props The cv data
 * @param {string} props.UserId UserId corresponding to a user_candidat
 * must be provided.
 * @param {string} props.urlImg
 * @param {string} props.story
 * @param {string} props.location
 * @param {string} props.availability
 * @param {string} props.transport
 * @param {string} props.catchphrase
 * @param {string} props.status
 * @param {number} props.version
 */
const generateCv = async (props = {}) => {
  const fakeData = {
    urlImg: `images/${props.UserId}.Progress.jpg`,
    story: fakerStatic.lorem.text(),
    location: fakerStatic.address.city(),
    availability: fakerStatic.lorem.sentence(),
    transport: fakerStatic.lorem.sentence(),
    catchphrase: fakerStatic.lorem.sentence(),
    status: getCvStatusValues(CV_STATUS)[0],
  };

  return {
    ...fakeData,
    ...props,
  };
};

/**
 * Create a cv in DB.
 *
 * @param {Object} props The cv data
 * @param {string} props.UserId UserId corresponding to a user_candidat
 * must be provided.
 * @param {string} props.urlImg
 * @param {string} props.story
 * @param {string} props.location
 * @param {string} props.availability
 * @param {string} props.transport
 * @param {string} props.catchphrase
 * @param {string} props.status
 * @param {number} props.version
 * @param {Object} components The ids of cv components:
 * - {Array<string>} ambitions
 * - {Array<string>} businessLines
 * - {Array<string>} contracts
 * - {Array<string>} languages
 * - {Array<string>} skills
 * - {Array<string>} locations
 * @param {boolean} insertInDB @default true
 * @return {Promise<CV>}
 */
const cvFactory = async (props = {}, components = {}, insertInDB = true) => {
  const cvData = await generateCv(props);

  const cvFull = {
    ...cvData,
  };

  let cvDB;
  if (insertInDB) {
    cvDB = await models.CV.create(cvFull);

    _.forEach(Object.keys(components), async (componentKey) => {
      const modelName =
        componentKey.charAt(0).toUpperCase() + componentKey.substring(1);

      if (
        Object.keys(models[modelName.slice(0, -1)].rawAttributes).includes(
          'CVId'
        )
      ) {
        await Promise.all(
          components[componentKey].map(async (component) => {
            const instance = await models[modelName.slice(0, -1)].create({
              CVId: cvDB.id,
              ...component,
            });

            // TODO Make generic
            const childrenComponentKey = 'skills';
            const childrenModelName =
              childrenComponentKey.charAt(0).toUpperCase() +
              childrenComponentKey.substring(1);
            if (
              modelName === 'Experiences' &&
              component[childrenComponentKey]
            ) {
              const childrenInstances = await Promise.all(
                component[childrenComponentKey].map((component) => {
                  return models[childrenModelName.slice(0, -1)].create({
                    name: component,
                  });
                })
              );
              await instance[`add${childrenModelName}`](childrenInstances);
            }
          })
        );
      } else {
        const instances = await Promise.all(
          components[componentKey].map((component) => {
            if (_.isString(component)) {
              return models[modelName.slice(0, -1)].create({ name: component });
            } else {
              return models[modelName.slice(0, -1)].create(component);
            }
          })
        );
        await cvDB[`add${modelName}`](instances);
      }
    });
    await models.CV_Search.create({
      id: uuid(),
      CVId: cvDB.id,
      searchString: JSON.stringify({ ...cvFull, ...props }),
    });
  }

  return insertInDB ? cvDB.dataValues : cvFull;
};

export default cvFactory;
