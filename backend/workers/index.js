const Queue = require('bull');

const {
  generatePDF,
  generatePreview,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
} = require('./CV');

const { WORKERS } = require('../../constants');

const { sendMailBackground } = require('./Mail');

const { insertAirtable, updateAirtable } = require('./Airtable');

const workQueue = new Queue(WORKERS.QUEUES.WORK, process.env.REDIS_URL);

const addToWorkQueue = async (data) => {
  return workQueue.add(data, {
    attempts: process.env.JOBS_NB_ATTEMPS || 10,
    backoff: {
      type: 'exponential',
      delay: process.env.JOBS_BACKOFF_DELAY || 60000,
    },
  });
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
  updateAirtable,
};
