const throng = require('throng');
const Queue = require('bull');
const { WORKER_TYPES } = require('../constants');
const {
  generatePDF,
  processImage,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
  sendMailBackground,
  insertAirtable,
  updateAirtable,
} = require('./workers');

const workers = process.env.WEB_CONCURRENCY || 1;

const maxJobsPerWorker = process.env.MAX_JOBS_PER_WORKER || 50;

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
    const timeInQueue = job.processedOn - job.timestamp;
    console.log(`Job ${job.id} of type ${job.data.type} has started after waiting for ${timeInQueue} ms`);
  });

  workQueue.on('error', (error) => {
    console.log(`An error occured on the work queue : ${error}`);
  });

  workQueue.process(maxJobsPerWorker, async (job) => {
    const { data } = job;
    switch (data.type) {
      case WORKER_TYPES.GENERATE_CV_PDF:
        await generatePDF(data.userId, data.token, data.paths);
        return `"PDF generated for User ${data.userId} : ${data.paths[2]}"`;

      case WORKER_TYPES.GENERATE_CV_PREVIEW:
        const previewImageName = await processImage(data.cv, data.file);
        return `"Preview generated for User ${data.cv.UserId} and CV ${data.cv.id} : ${previewImageName}"`;

      case WORKER_TYPES.CACHE_CV:
        const cv = await cacheCV(data.url, data.id);
        return cv
          ? `"CV cached for User ${cv.UserId} and CV ${cv.id}${
              data.url ? ` and URL ${data.url}` : ''
            }"`
          : `"CV not cached"`;

      case WORKER_TYPES.CACHE_ALL_CVS:
        const cvs = await cacheAllCVs();
        return cvs && cvs.length > 0
          ? `"All published CVs cached"`
          : `"No CVs cached"`;

      case WORKER_TYPES.CREATE_CV_SEARCH_STRING:
        await createCVSearchString(data.cv);
        return `"CV search string created for User ${data.cv.UserId} and CV ${data.cv.id}"`;

      case WORKER_TYPES.SEND_MAIL:
        await sendMailBackground(data);
        return `"Mail sent to "${data.toEmail}" and subject '${data.subject}'"`;

      case WORKER_TYPES.INSERT_AIRTABLE:
        await insertAirtable(data.tableName, data.fields);
        return `"Airtable : insertion in '${data.tableName}'"`;

      case WORKER_TYPES.UPDATE_AIRTABLE:
        await updateAirtable(data.tableName, data.idToUpdate, data.fields);
        return `"Airtable : update of id ${data.idToUpdate} in '${data.tableName}'"`;

      default:
        return `"No process method for this job ${job.id} of type ${job.data.type}"`;
    }
  });
};

throng({ workers, start });
