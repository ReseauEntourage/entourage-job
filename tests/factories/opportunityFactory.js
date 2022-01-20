import faker from 'faker';

import { models } from 'src/db/models';
import { DEPARTMENTS } from 'src/constants/departements';
import moment from 'moment';
const { Opportunity } = models;

let totalOppsInDB = 0;

const getTotalOppsInDB = () => {
  return totalOppsInDB;
};

const incrTotalOppsInDB = () => {
  totalOppsInDB += 1;
};

/**
 * an oject which contains the data necessary
 * to build an opportuity.
 *
 * @param {Object} props opportunity data
 * @param {string} props.title
 * @param {boolean} props.isPublic
 * @param {boolean} props.isExternal
 * @param {boolean} props.isValidated
 * @param {boolean} props.isArchived
 * @param {string} props.company
 * @param {string} props.companyDescription
 * @param {string} props.recruiterName
 * @param {string} props.recruiterFirstName
 * @param {string} props.recruiterMail
 * @param {string} props.recruiterPhone
 * @param {string} props.recruiterPosition
 * @param {string} props.message
 * @param {string} props.link
 * @param {string} props.externalOrigin
 * @param {string} props.department
 * @param {string} props.date
 * @param {string} props.decription
 * @param {string} props.prerequisites
 * @param {string} props.skills
 * @param {string} props.contract
 * @param {string} props.endOfContract
 * @param {string} props.isPartTime
 * @param {string} props.numberOfPositions
 * @param {string} props.beContacted
 * @param {string} props.createdAt
 */
const generateOpportunity = async (props) => {
  const data = {
    title: faker.lorem.words(2),
    isPublic: true,
    isExternal: false,
    isValidated: true,
    isArchived: false,
    company: faker.company.companyName(2),
    companyDescription: faker.lorem.paragraphs(3),
    recruiterName: faker.name.findName(),
    recruiterFirstName: faker.name.findName(),
    recruiterMail: faker.internet.email(),
    recruiterPhone: faker.phone.phoneNumber(),
    recruiterPosition: faker.lorem.words(2),
    department: DEPARTMENTS[0].name,
    date: moment().toISOString(),
    description: faker.lorem.paragraphs(3),
    prerequisites: faker.lorem.paragraphs(3),
    skills: faker.lorem.paragraphs(3),
    contract: faker.lorem.words(2),
    endOfContract: moment().format('YYYY-MM-DD'),
    startOfContract: moment().format('YYYY-MM-DD'),
    isPartTime: faker.random.boolean(),
    beContacted: faker.random.boolean(),
    numberOfPositions: faker.random.number(),
    createdAt: moment().toISOString(),
    updatedAt: moment().toISOString(),
    message: faker.lorem.paragraphs(3),
    link: faker.lorem.words(2),
    externalOrigin: faker.lorem.words(2),
  };
  return {
    ...data,
    ...props,
  };
};
/**
 * Create an opportunity and insert it in DB if desired
 *
 * @param {*} props
 * @param {*} insertInDB
 * @returns opportunity inserted in DB (with id generated at insertion),
 * @opional if no DB insertion returns the generated data (no id).
 */
const opportunityFactory = async (props = {}, insertInDB = true) => {
  let opportunityData = await generateOpportunity(props);

  if (insertInDB) {
    const answer = await Opportunity.create(opportunityData);
    opportunityData = answer.dataValues;
    incrTotalOppsInDB();
  }
  return opportunityData;
};

export default opportunityFactory;
export { getTotalOppsInDB, incrTotalOppsInDB };
