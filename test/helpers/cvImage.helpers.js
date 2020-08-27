const fs = require('fs');
const fakerStatic = require('faker');

const path = require('path');

/**
 * Create a lorem image
 */
const createTestImage = () => {
    const image = fakerStatic.image.cats(600, 600);
    const fileName = path.join(process.cwd(), 'imageTest.jpg')

    fs.writeFile(path, image, (error) => {
        if (error) {
            throw Error(error)
        }
    })

    return fileName;
}

/**
 * Delete a file
 * 
 * @param {string} pathToFile 
 */
const deleteTestImage = (pathToFile) => {
    fs.unlink(pathToFile, (error) => {
        if (error) throw error;
        console.log(`Deleted: ${pathToFile}`)
    });
}

module.exports = {
    createTestImage,
    deleteTestImage,
}