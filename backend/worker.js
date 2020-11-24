const Queue = require('bull');
/*const { WORKER_KEYS } = require('../constants');
const {
  generatePDF,
  processImage,
  cacheCV,
  createCVSearchString,
} = require('./workers');*/

const workQueue = new Queue('work', process.env.REDIS_URL);

workQueue.on('completed', (job, result) => {
  console.log(
    `Job ${job.id} of type ${job.name} completed with result ${result}`
  );
});

workQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} of type ${job.name} failed with result ${err}`);
});

workQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting to be processed`);
});

workQueue.on('active', (job, jobPromise) => {
  console.log(`Job ${job.id} of type ${job.name} has started`);
});

workQueue.on('error', (error) => {
  console.log(`An error occured on the work queue : ${error}`);
});

workQueue.process(async (job) => {
  console.log('RECEIVED JOB = ', job);
  /* switch (job.name) {
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
  } */
  return Promise.resolve();
});

module.exports = {
  workQueue,
};
