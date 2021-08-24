const loadEnvironementVariables = require('./utils/env');

loadEnvironementVariables();

// eslint-disable-next-line import/order
const throng = require('throng');

const { getMainWorkQueue } = require('./utils/WorkQueue');

const { attachListeners, maxJobsPerWorker, workers } = require('./jobs');

const start = () => {
  const workQueue = getMainWorkQueue();

  attachListeners(workQueue);

  workQueue.process(
    maxJobsPerWorker,
    `${__dirname}/processors/mainQueueProcessor.js`
  );
};

throng({ workers, start });
