const Queue = require('bull');
const { WORKER_KEYS } = require('../constants');
const { generatePDF, processImage, cacheCV, createCVSearchString } = require('./workers');

const workQueue = new Queue('work', process.env.REDIS_URL);

// Define a local completed event
workQueue.on('completed', (job, result) => {
  console.log(
    `Job ${job.id} of type ${job.name} completed with result ${result}`
  );
});

workQueue.process(async (job) => {
  console.log('RECEIVED JOB = ', job);
  /*switch (job.name) {
    case WORKER_KEYS.GENERATE_CV_PDF:
      return generatePDF(...job.data);
    case WORKER_KEYS.GENERATE_CV_PREVIEW:
      return processImage(...job.data);
    case WORKER_KEYS.CACHE_CV:
      return cacheCV(...job.data);
    case WORKER_KEYS.CREATE_CV_SEARCH_STRING:
      return createCVSearchString(...job.data);
    default:
      break;
  }*/
  return Promise.resolve();
});

module.exports = {
  workQueue,
};
