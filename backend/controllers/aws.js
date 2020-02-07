const S3 = require('aws-s3');

const S3Client = new S3({
  bucketName: 'Entourage',
  dirName: 'images' /* optional */,
  region: 'eu-west-1',
  accessKeyId: process.env.AWSS3_ID,
  secretAccessKey: process.env.AWSS3_SECRET,
  s3Url:
    'https://s3.console.aws.amazon.com/s3/buckets/entourage-job-preprod/' /* optional */,
});
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

/* This is optional */
const uploadFile = (file, fileName) => {
  S3Client.uploadFile(file, fileName)
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
};

const deleteFile = (fileName) => {
  S3Client.deleteFile(fileName)
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
};
/**
 * {
 *   Response: {
 *     bucket: "your-bucket-name",
 *     key: "photos/image.jpg",
 *     location: "https://your-bucket.s3.amazonaws.com/photos/image.jpg"
 *   }
 * }
 */

module.exports = {
  uploadFile,
  deleteFile,
};
