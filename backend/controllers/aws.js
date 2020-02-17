const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
// The name of the bucket that you have created
const BUCKET_NAME = 'Entourage';

const s3 = new S3({
  accessKeyId: process.env.AWSS3_ID,
  secretAccessKey: process.env.AWSS3_SECRET,
  Bucket: BUCKET_NAME,
});

const uploadFile = (input, output) => {
  // Read content from the file
  const fileContent = fs.readFileSync(input);

  // Setting up S3 upload parameters
  const params = {
    Key: output, // File name you want to save as in S3
    Body: fileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

module.exports = { uploadFile };
