// eslint-disable-next-line import/order
const loadEnvironementVariables = require('./utils/env');

loadEnvironementVariables();

const throng = require('throng');
const Pusher = require('pusher');

const { getImageQueue } = require('./utils/WorkQueue');

const { JOBS, SOCKETS } = require('../constants');
const { generatePreview, attachListeners } = require('./jobs');

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

const start = () => {
  const workQueue = getImageQueue();

  attachListeners(workQueue);

  workQueue.process(maxJobsPerWorker, async (job) => {
    const { data } = job;
    switch (data.type) {
      case JOBS.JOB_TYPES.GENERATE_CV_PREVIEW:
        const previewImageName = await generatePreview(
          data.candidatId,
          data.uploadedImg,
          data.oldImg
        );
        await pusher.trigger(
          SOCKETS.CHANNEL_NAMES.CV_PREVIEW,
          SOCKETS.EVENTS.CV_PREVIEW_DONE,
          {
            candidatId: data.candidatId,
          }
        );
        return `Preview generated for User ${data.candidatId} : ${previewImageName}`;

      default:
        return `No process method for this job ${job.id} of type ${job.data.type}`;
    }
  });
};

throng({ workers, start });
