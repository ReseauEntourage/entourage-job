const Queue = require('bull');

const {
  generatePDF,
  generatePreview,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
} = require('./CV');

const dev = process.env.NODE_ENV !== 'production';

const { JOBS } = require('../../constants');

const { sendMailBackground } = require('./Mail');

const { insertAirtable, updateOpportunityAirtable } = require('./Airtable');

const workQueue = new Queue(JOBS.QUEUES.WORK, process.env.REDIS_URL);

const addToWorkQueue = async (data) => {
  if (!dev) {
    return workQueue.add(data, {
      attempts: process.env.JOBS_NB_ATTEMPS
        ? parseInt(process.env.JOBS_NB_ATTEMPS, 10)
        : 10,
      backoff: {
        type: 'exponential',
        delay: process.env.JOBS_BACKOFF_DELAY
          ? parseInt(process.env.JOBS_BACKOFF_DELAY, 10)
          : 60000,
      },
    });
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
