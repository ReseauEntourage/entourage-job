const fs = require('fs');
const fakerStatic = require('faker');

const createTestImage = () => {
    const image = fakerStatic.image.cats(600, 600);
    const path = `${process.cwd()}/imageTest.jpg`

    fs.writeFile(path, image, (error) => {
        if (error) {
            throw Error(error)
        }
    })

    return path;
}

module.exports = {
    createTestImage,
}