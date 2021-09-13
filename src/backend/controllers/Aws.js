import {
  S3Client,
  GetObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as S3GetSignedUrl } from '@aws-sdk/s3-request-presigner';

const dev = process.env.NODE_ENV !== 'production';

// The name of the bucket that you have created
const s3 = new S3Client({
  region: 'eu-west-3',
  accessKeyId: process.env.AWSS3_ID,
  secretAccessKey: process.env.AWSS3_SECRET,
  signatureVersion: 'v4',
});

const upload = (data, contentType, outputPath, isPrivate) => {
  const key = `${
    contentType.includes('image/')
      ? process.env.AWSS3_IMAGE_DIRECTORY
      : process.env.AWSS3_FILE_DIRECTORY
  }${outputPath}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWSS3_BUCKET_NAME,
    Key: key, // File name you want to save as in S3
    Body: data,
    ACL: isPrivate ? 'private' : 'public-read', // allow public reading access to the file
    ContentType: contentType,
  });

  return new Promise((resolve, reject) => {
    // Uploading files to the bucket
    s3.send(putObjectCommand)
      .then(() => {
        console.log('============ AWS Upload ============', key);
        resolve(key);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteFiles = (keys) => {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  const deleteObjectsCommand = new DeleteObjectsCommand({
    Bucket: process.env.AWSS3_BUCKET_NAME,
    Delete: {
      Objects: keys.map((key) => {
        return { Key: key };
      }),
    },
  });

  return new Promise((resolve, reject) => {
    if (!dev) {
      // Deleting files
      s3.send(deleteObjectsCommand)
        .then(() => {
          console.log('============ AWS Delete ============', keys);
          resolve(keys);
        })
        .catch((err) => {
          reject(err);
        });
    }
    resolve(keys);
  });
};

const getHead = (key) => {
  const headObjectCommand = new HeadObjectCommand({
    Bucket: process.env.AWSS3_BUCKET_NAME,
    Key: key,
  });

  return new Promise((resolve, reject) => {
    // Getting file headers
    s3.send(headObjectCommand)
      .then((data) => {
        console.log('============ AWS Head ============', key);
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getSignedUrl = (key) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.AWSS3_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: 'attachment',
    ResponseContentType: 'application/pdf',
  });

  return new Promise((resolve, reject) => {
    S3GetSignedUrl(s3, getObjectCommand, {
      Expires: 60,
    })
      .then((url) => {
        console.log('Signed URL', url);
        resolve(url);
      })
      .catch((err) => {
        console.log('Error', err);
        reject(err);
      });
  });
};

export { upload, deleteFiles, getSignedUrl, getHead };
