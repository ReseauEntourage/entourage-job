const throng = require('throng');
const Queue = require('bull');
const Pusher = require('pusher');

const { WORKERS, SOCKETS } = require('../constants');
const {
  generatePDF,
  generatePreview,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
  sendMailBackground,
  insertAirtable,
  updateAirtable,
} = require('./workers');

const workers = process.env.WEB_CONCURRENCY || 1;

const maxJobsPerWorker = process.env.JOBS_MAX_PER_WORKER || 50;

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_API_KEY,
  secret: process.env.PUSHER_API_SECRET,
  cluster: 'eu',
  useTLS: true,
});

const start = () => {
  const workQueue = new Queue(WORKERS.QUEUES.WORK, process.env.REDIS_URL);

  workQueue.on('completed', (job, result) => {
    console.log(
      `Job ${job.id} of type ${job.data.type} completed with result : "${result}"`
    );
  });

  workQueue.on('failed', (job, err) => {
    console.log(
      `Job ${job.id} of type ${job.data.type} failed with error : "${err}"`
    );
  });

  workQueue.on('waiting', (jobId) => {
    console.log(`Job ${jobId} is waiting to be processed`);
  });

  workQueue.on('active', (job, jobPromise) => {
    const timeInQueue = job.processedOn - job.timestamp;
    console.log(
      `Job ${job.id} of type ${job.data.type} has started after waiting for ${timeInQueue} ms`
    );
  });

  workQueue.on('error', (error) => {
    console.log(`An error occured on the work queue : "${error}"`);
  });

  workQueue.process(maxJobsPerWorker, async (job) => {
    const { data } = job;
    switch (data.type) {
      case WORKERS.WORKER_TYPES.GENERATE_CV_PDF:
        await generatePDF(data.candidatId, data.token, data.paths);
        return `PDF generated for User ${data.candidatId} : ${data.paths[2]}`;

      case WORKERS.WORKER_TYPES.GENERATE_CV_PREVIEW:
        const previewImageName = await generatePreview(
          data.candidatId,
          data.file,
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

      case WORKERS.WORKER_TYPES.CACHE_CV:
        const cv = await cacheCV(data.url, data.id);
        return cv
          ? `CV cached for User ${cv.UserId} and CV ${cv.id}${
              data.url ? ` and URL ${data.url}` : ''
            }`
          : `CV not cached`;

      case WORKERS.WORKER_TYPES.CACHE_ALL_CVS:
        const cvs = await cacheAllCVs();
        return cvs && cvs.length > 0
          ? `All published CVs cached`
          : `No CVs cached`;

      case WORKERS.WORKER_TYPES.CREATE_CV_SEARCH_STRING:
        await createCVSearchString(data.candidatId);
        return `CV search string created for User ${data.candidatId}`;

      case WORKERS.WORKER_TYPES.SEND_MAIL:
        await sendMailBackground(data);
        return `Mail sent to '${data.toEmail}' and subject '${data.subject}'`;

      case WORKERS.WORKER_TYPES.INSERT_AIRTABLE:
        await insertAirtable(data.tableName, data.fields);
        return `Airtable : insertion in '${data.tableName}'`;

      case WORKERS.WORKER_TYPES.UPDATE_AIRTABLE:
        await updateAirtable(data.tableName, data.idToUpdate, data.fields);
        return `Airtable : update of id ${data.idToUpdate} in '${data.tableName}'`;

      default:
        return `No process method for this job ${job.id} of type ${job.data.type}`;
    }
  });
};

throng({ workers, start });
