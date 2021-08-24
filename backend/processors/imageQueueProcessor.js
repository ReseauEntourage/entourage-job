const loadEnvironementVariables = require('../utils/env');

loadEnvironementVariables();

const { JOBS, SOCKETS } = require('../../constants');
const { pusher } = require('../jobs');
const { generatePreview } = require('../jobs/Image');

module.exports = async (job) => {
  const { data } = job;
  switch (data.type) {
    case JOBS.JOB_TYPES.GENERATE_CV_PREVIEW:
      const previewImageName = await generatePreview(
        data.candidatId,
        data.uploadedImg,
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

    default:
      return `No process method for this job ${job.id} of type ${job.data.type}`;
  }
};
