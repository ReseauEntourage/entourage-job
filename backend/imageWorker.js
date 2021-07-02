const loadEnvironementVariables = require('./utils/env');

loadEnvironementVariables();

// eslint-disable-next-line import/order
const throng = require('throng');

const { getImageQueue } = require('./utils/WorkQueue');

const { attachListeners, maxJobsPerWorker, workers } = require('./jobs');

const start = () => {
  const workQueue = getImageQueue();

  attachListeners(workQueue);

  workQueue.process(
    maxJobsPerWorker,
    `${__dirname}/processors/imageQueueProcessor.js`
  );
};

throng({ workers, start });
