// eslint-disable-next-line import/order
const loadEnvironementVariables = require('./utils/env');

loadEnvironementVariables();

const throng = require('throng');
const Pusher = require('pusher');

const { getWorkQueue } = require('./utils/WorkQueue');

const { JOBS, SOCKETS } = require('../constants');
const {
  generatePDF,
  generatePreview,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
  sendMailBackground,
  insertAirtable,
  updateOpportunityAirtable,
} = require('./jobs');

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
  const workQueue = getWorkQueue();

  workQueue.on('completed', (job, result) => {
    console.log(
      `Job ${job.id} of type ${job.data.type} completed with result : "${result}"`
    );
  });

  workQueue.on('failed', (job, err) => {
    // TODO send error to socket to stop loading if preview or PDF
    console.error(
      `Job ${job.id} of type ${job.data.type} failed with error : "${err}"`
    );
  });

  workQueue.on('waiting', (jobId) => {
    console.log(`Job ${jobId} is waiting to be processed`);
  });

  workQueue.on('active', (job) => {
    const timeInQueue = job.processedOn - job.timestamp;
    console.log(
      `Job ${job.id} of type ${job.data.type} has started after waiting for ${timeInQueue} ms`
    );
  });

  workQueue.on('error', (error) => {
    console.error(`An error occured on the work queue : "${error}"`);
  });

  workQueue.process(maxJobsPerWorker, async (job) => {
    const { data } = job;
    switch (data.type) {
      case JOBS.JOB_TYPES.GENERATE_CV_PDF:
        await generatePDF(data.candidatId, data.token, data.paths);
        await pusher.trigger(
          SOCKETS.CHANNEL_NAMES.CV_PDF,
          SOCKETS.EVENTS.CV_PDF_DONE,
          {
            candidatId: data.candidatId,
          }
        );
        return `PDF generated for User ${data.candidatId} : ${data.paths[2]}`;

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

      case JOBS.JOB_TYPES.CACHE_CV:
        const cv = await cacheCV(data.url, data.candidatId);
        return cv
          ? `CV cached for User ${cv.UserId} and CV ${cv.id}${
              data.url ? ` and URL ${data.url}` : ''
            }`
          : `CV not cached`;

      case JOBS.JOB_TYPES.CACHE_ALL_CVS:
        const cvs = await cacheAllCVs();
        return cvs && cvs.length > 0
          ? `All published CVs cached`
          : `No CVs cached`;

      case JOBS.JOB_TYPES.CREATE_CV_SEARCH_STRING:
        await createCVSearchString(data.candidatId);
        return `CV search string created for User ${data.candidatId}`;

      case JOBS.JOB_TYPES.SEND_MAIL:
        await sendMailBackground(data);
        return `Mail sent to '${data.toEmail}' and subject '${data.subject}'`;

      case JOBS.JOB_TYPES.INSERT_AIRTABLE:
        await insertAirtable(data.tableName, data.fields);
        return `Airtable : insertion in '${data.tableName}'`;

      case JOBS.JOB_TYPES.UPDATE_AIRTABLE:
        await updateOpportunityAirtable(data.tableName, data.fields);
        return `Airtable : update in '${data.tableName}'`;

      default:
        return `No process method for this job ${job.id} of type ${job.data.type}`;
    }
  });
};

throng({ workers, start });
