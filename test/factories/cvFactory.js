const fakerStatic = require('faker');
const { CV_STATUS } = require('../../constants');
const {
    models: {
        CV,
    }
} = require('../../backend/db/models');

/**
 * Extract cv status values from CV_STATUS constant
 * 
 * @param {Obect} cvStatus : CV_STATUS conctant
 * @retrn array of status values
 */
const getCvStatusValues = (cvStatus) => {
    return Object.keys(cvStatus).map((status) => cvStatus[status].value);
}

/**
 * Generate data to create a CV
 * 
 * @param {Object<{
 *                  UserId: 
 *         }>
 * } props valid UserId corresponding to a user_candidat
 * must be provided.
 */
const generateCv = async (props = {}) => {
    const fakeData = {
        urlImg: fakerStatic.image.imageUrl(),
        intro: fakerStatic.lorem.sentence(),
        story: fakerStatic.lorem.text(),
        location: fakerStatic.address.city(),
        availability: fakerStatic.lorem.sentence(),
        transport: fakerStatic.lorem.sentence(),
        catchphrase: fakerStatic.lorem.sentence(),
        devise: fakerStatic.lorem.sentence(),
        careerPathOpen: fakerStatic.random.boolean(),
        status: fakerStatic.random.arrayElement(getCvStatusValues(CV_STATUS)),
        version: 1,
    }
    return {
        ...fakeData,
        ...props
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
    insertInDB = true,
) => {
    const cvData = await generateCv(props);
    const cvFull = {
        ...cvData,
        ...associationsId
    }
    const cvDB = await CV.create(cvFull);
    return insertInDB ? cvDB.dataValues : cvFull;
}

module.exports = cvFactory;