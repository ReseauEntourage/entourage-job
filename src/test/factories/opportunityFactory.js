import faker from 'faker';

import { models } from 'src/backend/db/models';

const { Opportunity } = models;

/**
 * an oject which contains the data necessary
 * to build an opportuity.
 *
 * @param {Object} props opportunity data
 * @param {string} props.title
 * @param {boolean} props.isPublic
 * @param {boolean} props.isValidated
 * @param {boolean} props.isArchived
 * @param {string} props.company
 * @param {string} props.companyDescription
 * @param {string} props.recruiterName
 * @param {string} props.recruiterFirstName
 * @param {string} props.recruiterMail
 * @param {string} props.recruiterPhone
 * @param {string} props.recruiterPosition
 * @param {string} props.department
 * @param {string} props.date
 * @param {string} props.decription
 * @param {string} props.prerequisites
 * @param {string} props.skills
 * @param {string} props.contract
 * @param {string} props.endOfContract
 * @param {string} props.isPartTime
 * @param {string} props.numberOfPositions
 * @param {string} props.beContacter
 * @param {string} props.createdAt
 */
const generateOpportunity = async (props) => {
  const data = {
    title: faker.lorem.words(2),
    isPublic: faker.random.boolean(),
    isValidated: faker.random.boolean(),
    isArchived: faker.random.boolean(),
    company: faker.company.companyName(2),
    companyDescription: faker.lorem.paragraphs(3),
    recruiterName: faker.name.findName(),
    recruiterFirstName: faker.name.findName(),
    recruiterMail: faker.internet.email(),
    recruiterPhone: faker.phone.phoneNumber(),
    recruiterPosition: faker.lorem.words(2),
    department: faker.address.zipCode(),
    date: faker.date.past(),
    description: faker.lorem.paragraphs(3),
    prerequisites: faker.lorem.paragraphs(3),
    skills: faker.lorem.paragraphs(3),
    contract: faker.lorem.words(2),
    endOfContract: faker.date.future(),
    startOfContract: faker.date.future(),
    isPartTime: faker.random.boolean(),
    beContacted: faker.random.boolean(),
    numberOfPositions: faker.random.number(),
    createdAt: faker.date.past(),
    message: faker.lorem.paragraphs(3),
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
  }
  return opportunityData;
};

export default opportunityFactory;
