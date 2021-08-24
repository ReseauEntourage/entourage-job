import * as S3 from 'src/backend/controllers/Aws';
import createPreviewImage from 'src/backend/shareImage';
import { getUser } from 'src/backend/controllers/User';

import { getCVbyUserId } from 'src/backend/controllers/CV';

const generatePreview = async (candidatId, uploadedImg, oldImg) => {
  const cv = await getCVbyUserId(candidatId);

  const ratio = 2.1;
  const imageWidth = Math.trunc(520 * ratio);
  const imageHeight = Math.trunc(272 * ratio);

  let urlImg;

  // uploading image and generating preview image
  if (uploadedImg) {
    urlImg = uploadedImg;
  } else if (oldImg) {
    try {
      const { Body } = await S3.download(oldImg);

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
      const { firstName, gender } = await getUser(candidatId);

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

export { generatePreview };
