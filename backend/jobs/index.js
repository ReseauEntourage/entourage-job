const Queue = require('bull');

const dev = process.env.NODE_ENV !== 'production';

const { JOBS } = require('../../constants');

const { sendMailBackground } = require('./Mail');

const { insertAirtable, updateOpportunityAirtable } = require('./Airtable');

const {
  generatePDF,
  generatePreview,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
} = require('./CV');

const workQueue = new Queue(JOBS.QUEUES.WORK, process.env.REDIS_URL);

const addToWorkQueue = async (data) => {
  if (!dev) {
    try {
      workQueue.add(data, {
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
      });
    } catch (err) {
      console.error('Failed to add job to queue : ', err);
    }
  }
  return Promise.resolve();
};

module.exports = {
  addToWorkQueue,
  generatePDF,
  generatePreview,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
  sendMailBackground,
  insertAirtable,
  updateOpportunityAirtable,
};
