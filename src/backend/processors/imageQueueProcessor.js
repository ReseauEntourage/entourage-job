import { JOBS, SOCKETS } from 'src/constants';
import { pusher } from 'src/backend/jobs';
import { generatePreview } from 'src/backend/jobs/Image';

export default async (job) => {
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
