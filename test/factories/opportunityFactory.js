const faker = require('faker');

const {
    models: {
        Opportunity,
    }
} = require('../../backend/db/models');

const generateOpportunity = async (props) => {
    const data = {
        title: faker.lorem.words(2),
        isPublic: faker.random.boolean(),
        isValidated: faker.random.boolean(),
        isArchived: faker.random.boolean(),
        company: faker.company.companyName(2),
        recruiterName: faker.name.findName(),
        recruiterEmail: faker.internet.email(),
        recruiterPhone: faker.phone.phoneNumber(),
        date: faker.date.past(),
        location: faker.address.city(),
        description: faker.lorem.paragraphs(3),
        createdAt: faker.date.past(),
    };
    return {
        ...data,
        ...props,
    }
}

const opportunityFactory = async (props = {}, insertInDB = true) => {
    const opportunityData = await generateOpportunity(props);

    if (insertInDB) {
        await Opportunity.create(opportunityData);
    }
    return opportunityData;
}

module.exports = opportunityFactory;