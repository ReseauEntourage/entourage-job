import Pusher from 'pusher';

import { getMainWorkQueue } from 'src/utils/WorkQueue';

const dev = process.env.NODE_ENV !== 'production';

const workers = process.env.WEB_CONCURRENCY
  ? parseInt(process.env.WEB_CONCURRENCY, 10)
  : 1;

const maxJobsPerWorker = process.env.JOBS_MAX_PER_WORKER
  ? parseInt(process.env.JOBS_MAX_PER_WORKER, 10)
  : 50;

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_API_KEY,
  secret: process.env.PUSHER_API_SECRET,
  cluster: 'eu',
  useTLS: true,
});

const workQueue = getMainWorkQueue();

const queueOptions = {
  attempts: process.env.JOBS_NB_ATTEMPS
    ? parseInt(process.env.JOBS_NB_ATTEMPS, 10)
    : 10,
  backoff: {
    type: 'exponential',
    delay: process.env.JOBS_BACKOFF_DELAY
      ? parseInt(process.env.JOBS_BACKOFF_DELAY, 10)
      : 60000,
  },
  removeOnFail: true,
  removeOnComplete: true,
};

const addToWorkQueue = async (data, options = {}) => {
  if (!dev || process.env.DEBUG_JOBS) {
    try {
      workQueue.add(data, { ...queueOptions, ...options });
    } catch (err) {
      console.error('Failed to add job to queue : ', err);
    }
  }
  return Promise.resolve();
};

const attachListeners = (queue) => {
  queue.on('completed', (job, result) => {
    console.log(
      `Job ${job.id} of type ${job.data.type} completed with result : "${result}"`
    );
  });

  queue.on('failed', (job, err) => {
    // TODO send error to socket to stop loading if preview or PDF
    console.error(
      `Job ${job.id} of type ${job.data.type} failed with error : "${err}"`
    );
    console.error(job.data);
  });

  queue.on('waiting', (jobId) => {
    console.log(`Job ${jobId} is waiting to be processed`);
  });

  queue.on('active', (job) => {
    const timeInQueue = job.processedOn - job.timestamp;
    console.log(
      `Job ${job.id} of type ${job.data.type} has started after waiting for ${timeInQueue} ms`
    );
  });

  queue.on('error', (error) => {
    console.error(`An error occured on the work queue : "${error}"`);
  });
};

export { workers, pusher, maxJobsPerWorker, attachListeners, addToWorkQueue };
