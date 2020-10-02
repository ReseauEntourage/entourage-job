const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

// The name of the bucket that you have created
const s3 = new S3({
  accessKeyId: process.env.AWSS3_ID,
  secretAccessKey: process.env.AWSS3_SECRET,
});

const upload = (data, contentType, outputPath) => {
  return new Promise((resolve, reject) => {
    // Uploading files to the bucket
    s3.upload(
      {
        Bucket: process.env.AWSS3_BUCKET_NAME,
        Key: `${contentType.includes('image/') ? process.env.AWSS3_IMAGE_DIRECTORY : process.env.AWSS3_FILE_DIRECTORY}${outputPath}`, // File name you want to save as in S3
        Body: data,
        ACL: 'public-read', // allow public reading access to the file
        ContentType: contentType
      },
      (err, {Key}) => {
        if (err) {
          reject(err);
        } else {
          console.log('============ AWS Upload ============', Key);
          resolve(Key);
        }
      }
    );
  });
};

const copy = (originalPath, outputPath) => {
  return new Promise((resolve, reject) => {
    // TODO doesn't work makes server crash
    // Copying files in the bucket
    s3.copyObject(
      {
        Bucket: process.env.AWSS3_BUCKET_NAME,
        CopySource: originalPath,
        Key: `${process.env.AWSS3_IMAGE_DIRECTORY}${outputPath}`,
      },
      (err, {Key}) => {
        if (err) {
          reject(err);
        } else {
          console.log('============ AWS Copy ============', Key);
          resolve(Key);
        }
      }
    );
  });
};

const deleteFile = (key) => {
  return new Promise((resolve, reject) => {
    // Deleting files
    s3.deleteObject(
      {
        Bucket: process.env.AWSS3_BUCKET_NAME,
        Key: key,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log('============ AWS Delete ============', key);
          resolve(data);
        }
      }
    );
  });
};

const download = (key) => {
  return new Promise((resolve, reject) => {
    // Downloading files
    s3.getObject(
      {
        Bucket: process.env.AWSS3_BUCKET_NAME,
        Key: key, // File name you want to save as in S3
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log('============ AWS Download ============', key);
          resolve(data);
        }
      }
    );
  });
};

const uploadFile = (path, outputPath) => {
  // Read content from the file
  const fileContent = fs.readFileSync(path);
  return upload(fileContent, outputPath);
};

module.exports = {upload, uploadFile, deleteFile, download, copy};
