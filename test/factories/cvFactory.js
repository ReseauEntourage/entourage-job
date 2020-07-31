const fakerStatic = require('faker');
const { CV_STATUS } = require('../../constants');
const CV = require('../../backend/db/models/cv');
/**
 * Generate data to create a CV
 * 
 * @param {Object} props valid user candidat Id must be provided
 */
const generateCv = async (props = {}) => {
    return {
        userId: props.userId || fakerStatic.random.uuid(),
        urlImg: props.urlImg || fakerStatic.image.imageUrl(),
        intro: props.intro || fakerStatic.lorem.sentence(),
        story: props.story || fakerStatic.lorem.text(),
        location: props.location || fakerStatic.address.city(),
        availability: props.availability || fakerStatic.lorem.sentence(),
        transport: props.transport || fakerStatic.lorem.sentence(),
        catchphrase: props.catchphrase || fakerStatic.lorem.sentence(),
        devise: props.devise || fakerStatic.lorem.sentence(),
        careerPathOpen: props.careerPathOpen || fakerStatic.random.boolean(),
        status: props.status ||
            fakerStatic.random.arrayElement(CV_STATUS.map((status => status.value))),
        version: props.version || 1,
    }
}

/**
 * Create a cv in DB.
 * 
 * @param {Object} props valid user candidat Id must be provided
 * @param {boolean} insertInDB 
 * @return 
 */
const cvFactory = async (
    props = {},
    associationsId = {},
    insertInDB = true
) => {
    const cvData = await generateCv(props);
    const cvFull = {
        ...cvData,
        ...associationsId
    }

    return insertInDB ? CV.create(cvFull) : cvData;
}

module.exports = cvFactory;