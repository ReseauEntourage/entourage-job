const fs = require('fs');

const sharp = require('sharp');
const S3 = require('../controllers/aws');
const createPreviewImage = require('../shareImage');
const UserController = require('../controllers/User');
const CVController = require('../controllers/CV');

const generatePDF = async (userId, token, paths) => {
  return CVController.generatePDF(userId, token, paths);
};

const processImage = async (cv, file) => {
  const ratio = 2.1;
  const imageWidth = Math.trunc(520 * ratio);
  const imageHeight = Math.trunc(272 * ratio);

  const generatePreviewImage = (url) => {
    return new Promise((resolve, reject) => {
      UserController.getUser(cv.UserId)
        .then(({ firstName, gender }) =>
          // Génération de la photo de preview
          S3.download(url)
            .then(async ({ Body }) =>
              createPreviewImage(
                imageWidth,
                imageHeight,
                Body,
                firstName,
                cv.catchphrase,
                cv.ambitions,
                cv.skills,
                cv.locations,
                gender
              )
            )
            .then((sharpData) => sharpData.jpeg({ quality: 75 }).toBuffer())
            .then((buffer) =>
              S3.upload(
                buffer,
                'image/jpeg',
                `${cv.UserId}.${cv.status}.preview.jpg`
              )
            )
            .then((previewUrl) => {
              console.log('preview uploaded: ', previewUrl);
              resolve(previewUrl);
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            })
        )
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  // uploading image and generating preview image
  if (file) {
    const { path } = file;
    try {
      const fileBuffer = await sharp(path)
        .trim()
        .jpeg({ quality: 75 })
        .toBuffer();

      await S3.upload(
        fileBuffer,
        'image/jpeg',
        `${cv.UserId}.${cv.status}.jpg`
      );

      /*
       TO KEEP If ever we want to pre-resize the preview background image

       const previewBuffer = await sharp(fileBuffer)
          .trim()
          .resize(imageWidth, imageHeight, {
            fit: 'cover',
          })
          .jpeg({quality: 75})
          .toBuffer();

        await S3.upload(
          previewBuffer,
          'image/jpeg',
          `${cv.UserId}.${cv.status}.small.jpg`
        );
    */
    } catch (error) {
      console.error(error);
    } finally {
      if (fs.existsSync(path)) fs.unlinkSync(path); // remove image localy after upload to S3
    }
  } else if (cv.urlImg) {
    try {
      const { Body } = await S3.download(cv.urlImg);

      await S3.upload(
        Body,
        'image/jpeg',
        `${cv.UserId}.${cv.status}.jpg`
      );

      /*
        TO KEEP If ever we want to pre-resize the preview background image

        const {Body} = await S3.download(cv.urlImg);
        await S3.upload(s3image.Body, 'image/jpeg', `${cv.UserId}.${cv.status}.small.jpg`);
      */

      // TODO use when we make it work
      // await S3.copy(cv.urlImg, `${cv.UserId}.${cv.status}.jpg`);
    } catch (error) {
      console.error(error);
    }
  }
  if (cv.urlImg) {
    try {
      return await generatePreviewImage(
        cv.urlImg /* .replace('.jpg', '.small.jpg') */
      );
    } catch (error) {
      console.log(error);
    }
  }
  return Promise.resolve();
};

const cacheCV = async (url) => {
  return CVController.getAndCacheCV(url);
};

const createCVSearchString = async (cv) => {
  return CVController.createSearchString(cv);
};

module.exports = {
  generatePDF,
  processImage,
  cacheCV,
  createCVSearchString,
};
