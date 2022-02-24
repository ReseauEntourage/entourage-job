import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';

import { getSignedUrl as S3GetSignedUrl } from '@aws-sdk/s3-request-presigner';

const clientConf = {
  region: 'eu-west-3',
  credentials: {
    accessKeyId: process.env.AWSS3_ID,
    secretAccessKey: process.env.AWSS3_SECRET,
  },
};

// The name of the bucket that you have created
const s3 = new S3Client(clientConf);
const cloudfront = new CloudFrontClient(clientConf);

const invalidateCache = (itemPaths) => {
  const invalidateObjectCommand = new CreateInvalidationCommand({
    DistributionId: process.env.CDN_ID,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: itemPaths.length,
        Items: itemPaths,
      },
    },
  });

  return new Promise((resolve, reject) => {
    cloudfront
      .send(invalidateObjectCommand)
      .then(({ Invalidation: Id }) => {
        console.log('============ AWS Invalidation ============', Id);
        resolve(Id);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

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
    // Deleting files
    s3.send(deleteObjectsCommand)
      .then(() => {
        console.log('============ AWS Delete ============', keys);
        resolve(keys);
      })
      .catch((err) => {
        reject(err);
      });
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

export { upload, deleteFiles, getSignedUrl, getHead, invalidateCache };
