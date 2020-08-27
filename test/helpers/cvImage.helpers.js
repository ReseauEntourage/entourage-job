const fs = require('fs');
const fakerStatic = require('faker');

const path = require('path');

const createTestImage = () => {
  // const image = fakerStatic.image.cats(600, 600);
  const fileName = path.join(process.cwd(), 'imageTest.jpg');

  // fs.writeFile(path, image, (error) => {
  //     if (error) {
  //         throw Error(error)
  //     }
  // })

  return fileName;
}

module.exports = {
  createTestImage,
}
