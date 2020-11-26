const Queue = require('bull');

const {
  generatePDF,
  processImage,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
} = require('./CV');

const { sendMailBackground } = require('./Mail');

const { insertAirtable, updateAirtable } = require('./Airtable');

const workQueue = new Queue('work', process.env.REDIS_URL);

const addToWorkQueue = async (data) => {
  return workQueue.add(data, {
    backoff: {
      type: 'exponential', // Backoff type, which can be either `fixed` or `exponential`. A custom backoff strategy can also be specified in `backoffStrategies` on the queue settings.
      delay: 10000, // Backoff delay, in milliseconds.
    },
  });
};

module.exports = {
  addToWorkQueue,
  generatePDF,
  processImage,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
  sendMailBackground,
  insertAirtable,
  updateAirtable,
};
