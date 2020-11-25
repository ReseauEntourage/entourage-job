const throng = require('throng');
const Queue = require('bull');
const { WORKER_TYPES } = require('../constants');
const {
  generatePDF,
  processImage,
  cacheCV,
  createCVSearchString,
} = require('./workers');

const workers = process.env.WEB_CONCURRENCY || 1;

// const maxJobsPerWorker = 50;

const start = () => {
  const workQueue = new Queue('work', process.env.REDIS_URL);

  workQueue.on('completed', (job, result) => {
    console.log(
      `Job ${job.id} of type ${job.data.type} completed with result ${result}`
    );
  });

  workQueue.on('failed', (job, err) => {
    console.log(
      `Job ${job.id} of type ${job.data.type} failed with error ${err}`
    );
  });

  workQueue.on('waiting', (jobId) => {
    console.log(`Job ${jobId} is waiting to be processed`);
  });

  workQueue.on('active', (job, jobPromise) => {
    console.log(`Job ${job.id} of type ${job.data.type} has started`);
  });

  workQueue.on('error', (error) => {
    console.log(`An error occured on the work queue : ${error}`);
  });

  workQueue.process(async (job) => {
    const { data } = job;
    switch (data.type) {
      case WORKER_TYPES.GENERATE_CV_PDF:
        return generatePDF(data.userId, data.token, data.paths);
      case WORKER_TYPES.GENERATE_CV_PREVIEW:
        return processImage(data.cv, data.file);
      case WORKER_TYPES.CACHE_CV:
        return cacheCV(data.url);
      case WORKER_TYPES.CREATE_CV_SEARCH_STRING:
        return createCVSearchString(data.cv);
      default:
        return Promise.resolve();
    }
  });
};

throng({ workers, start });
