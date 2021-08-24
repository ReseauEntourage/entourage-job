import { getImageQueue } from 'src/backend/utils/WorkQueue';

import throng from 'throng';

import { attachListeners, maxJobsPerWorker, workers } from 'src/backend/jobs';

const start = () => {
  const workQueue = getImageQueue();

  attachListeners(workQueue);

  workQueue.process(
    maxJobsPerWorker,
    `${__dirname}/processors/imageQueueProcessor.js`
  );
};

throng({ workers, start });
