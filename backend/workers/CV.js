const fs = require('fs');

const sharp = require('sharp');
const S3 = require('../controllers/Aws');
const createPreviewImage = require('../shareImage');
const { getUser } = require('../controllers/User');
const {
  generatePdfFromCV,
  getAndCacheCV,
  getAndCacheAllCVs,
  createSearchString,
} = require('../controllers/CV');

const generatePDF = async (userId, token, paths) => {
  return generatePdfFromCV(userId, token, paths);
};

const processImage = async (cv, file) => {
  const ratio = 2.1;
  const imageWidth = Math.trunc(520 * ratio);
  const imageHeight = Math.trunc(272 * ratio);

  let urlImg;

  // uploading image and generating preview image
  if (file) {
    const { path } = file;
    try {
      const fileBuffer = await sharp(path)
        .trim()
        .jpeg({ quality: 75 })
        .toBuffer();

      urlImg = await S3.upload(
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

      urlImg = await S3.upload(
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
  if (urlImg) {
    try {
      const { firstName, gender } = await getUser(cv.UserId);

      // Génération de la photo de preview
      const { Body } = await S3.download(cv.urlImg);
      const sharpData = await createPreviewImage(
        imageWidth,
        imageHeight,
        Body,
        firstName,
        cv.catchphrase,
        cv.ambitions,
        cv.skills,
        cv.locations,
        gender
      );
      const buffer = await sharpData.jpeg({ quality: 75 }).toBuffer();
      const previewUrl = await S3.upload(
        buffer,
        'image/jpeg',
        `${cv.UserId}.${cv.status}.preview.jpg`
      );
      console.log('preview uploaded: ', previewUrl);
      return previewUrl;
    } catch (error) {
      console.log(error);
    }
  }
  return Promise.resolve();
};

const cacheCV = async (url, id) => {
  return getAndCacheCV(url, id);
};

const cacheAllCVs = async () => {
  return getAndCacheAllCVs();
};

const createCVSearchString = async (cv) => {
  return createSearchString(cv);
};

module.exports = {
  generatePDF,
  processImage,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
};
