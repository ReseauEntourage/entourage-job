const fakerStatic = require('faker');
const { CV_STATUS } = require('../../constants');
const {
    models: {
        CV,
        User,
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
 * @param {Object} props The cv data
 * @param {string} props.UserId UserId corresponding to a user_candidat
 * must be provided.
 * @param {string} props.urlImg
 * @param {string} props.intro
 * @param {string} props.story
 * @param {string} props.location
 * @param {string} props.availability
 * @param {string} props.transport
 * @param {string} props.catchphrase
 * @param {string} props.devise
 * @param {boolean} props.careerPathOpen
 * @param {string} props.status
 * @param {number} props.version
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
    };

    return {
        ...fakeData,
        ...props
    }
}

/**
 * Create a cv in DB.
 * 
 * @param {Object} props The cv data
 * @param {string} props.UserId UserId corresponding to a user_candidat
 * must be provided.
 * @param {string} props.urlImg
 * @param {string} props.intro
 * @param {string} props.story
 * @param {string} props.location
 * @param {string} props.availability
 * @param {string} props.transport
 * @param {string} props.catchphrase
 * @param {string} props.devise
 * @param {boolean} props.careerPathOpen
 * @param {string} props.status
 * @param {number} props.version
 * @param {Object} componentsId The ids of cv components:
 * - {Array<string>} ambition
 * - {Array<string>} businesslines
 * - {Array<string>} constract
 * - {Array<string>} language
 * - {Array<string>} skill
 * @param {boolean} insertInDB @default true
 * @return {Promise<CV>}
 */
const cvFactory = async (
    props = {},
    componentsId = {},
    insertInDB = true,
) => {
    const cvData = await generateCv(props);
    const cvFull = {
        ...cvData,
        ...componentsId
    }
    let cvDB;
    if (insertInDB) {
        cvDB = await CV.create(cvFull);
    }
    return insertInDB ? cvDB.dataValues : cvFull;
}

module.exports = cvFactory;