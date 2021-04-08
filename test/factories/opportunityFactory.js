const faker = require('faker');

const {
  models: { Opportunity },
} = require('../../backend/db/models');

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
 * @param {string} props.recruiterName
 * @param {string} props.recruiterMail
 * @param {string} props.recruiterPhone
 * @param {string} props.date
 * @param {string} props.location
 * @param {string} props.decription
 * @param {string} props.prerequisites
 * @param {string} props.createdAt
 */
const generateOpportunity = async (props) => {
  const data = {
    title: faker.lorem.words(2),
    isPublic: faker.random.boolean(),
    isValidated: faker.random.boolean(),
    isArchived: faker.random.boolean(),
    company: faker.company.companyName(2),
    recruiterName: faker.name.findName(),
    recruiterMail: faker.internet.email(),
    recruiterPhone: faker.phone.phoneNumber(),
    date: faker.date.past(),
    location: faker.address.city(),
    description: faker.lorem.paragraphs(3),
    prerequisites: faker.lorem.paragraphs(3),
    createdAt: faker.date.past(),
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

module.exports = opportunityFactory;
