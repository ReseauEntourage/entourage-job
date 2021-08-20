import { getMainWorkQueue } from 'src/backend/utils/WorkQueue';

import throng from 'throng';

import { attachListeners, maxJobsPerWorker, workers } from 'src/backend/jobs';

const start = () => {
  const workQueue = getMainWorkQueue();

  attachListeners(workQueue);

  workQueue.process(
    maxJobsPerWorker,
    `${__dirname}/processors/mainQueueProcessor.js`
  );
};

throng({ workers, start });
