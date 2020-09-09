const path = require('path');

/**
 * Get path to test image
 */
const getTestImagePath = () => {
    const fileName = path.join(process.cwd(), '/test/testData/imageTest.jpg')

    return fileName;
}

module.exports = {
    getTestImagePath,
}
