import { CV_STATUS } from 'src/constants';

import { models } from 'src/db/models';

import fakerStatic from 'faker';
import uuid from 'uuid/v4';
import _ from 'lodash';

/**
 * Extract cv status values from CV_STATUS constant
 *
 * @param {Obect} cvStatus : CV_STATUS conctant
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
 * @param {boolean} props.careerPathOpen
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
    careerPathOpen: fakerStatic.random.boolean(),
    status: fakerStatic.random.arrayElement(getCvStatusValues(CV_STATUS)),
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
 * @param {boolean} props.careerPathOpen
 * @param {string} props.status
 * @param {number} props.version
 * @param {Object} components The ids of cv components:
 * - {Array<string>} ambition
 * - {Array<string>} businesslines
 * - {Array<string>} constract
 * - {Array<string>} language
 * - {Array<string>} skill
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

    // TODO manage creation of attached component in a cleaner way
    _.forEach(Object.keys(components), async (componentKey) => {
      switch (componentKey) {
        case 'locations':
          const locations = await Promise.all(
            components[componentKey].map((name) => {
              return models.Location.findOrCreate({
                where: { name },
              }).then((model) => {
                return model[0];
              });
            })
          );
          await cvDB.addLocation(locations);
          break;
        case 'businessLines':
          const businessLines = await Promise.all(
            components[componentKey].map((name) => {
              return models.BusinessLine.findOrCreate({
                where: { name },
              }).then((model) => {
                return model[0];
              });
            })
          );
          await cvDB.addBusinessLines(businessLines);
          break;
        default:
          break;
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
