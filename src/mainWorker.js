import { getMainWorkQueue } from 'src/utils/WorkQueue';

import throng from 'throng';

import { attachListeners, maxJobsPerWorker, pusher, workers } from 'src/jobs';
import { JOBS, SOCKETS } from 'src/constants';
import { sendMailBackground, sendReminderMailAboutOffer } from 'src/jobs/Mail';
import {
  cacheAllCVs,
  cacheCV,
  createCVSearchString,
  generatePDF,
} from 'src/jobs/CV';
import { insertAirtable, updateOpportunityAirtable } from 'src/jobs/Airtable';
import { generatePreview } from 'src/jobs/Image';

const start = () => {
  const workQueue = getMainWorkQueue();

  attachListeners(workQueue);

  workQueue.process(maxJobsPerWorker, async (job) => {
    const { data } = job;

    switch (data.type) {
      case JOBS.JOB_TYPES.GENERATE_CV_PDF:
        await generatePDF(data.candidatId, data.token, data.paths);
        await pusher.trigger(
          SOCKETS.CHANNEL_NAMES.CV_PDF,
          SOCKETS.EVENTS.CV_PDF_DONE,
          {
            candidatId: data.candidatId,
          }
        );
        return `PDF generated for User ${data.candidatId} : ${data.paths[2]}`;

      case JOBS.JOB_TYPES.CACHE_CV:
        const cv = await cacheCV(data.url, data.candidatId);
        return cv
          ? `CV cached for User ${cv.UserId} and CV ${cv.id}${
              data.url ? ` and URL ${data.url}` : ''
            }`
          : `CV not cached`;

      case JOBS.JOB_TYPES.CACHE_ALL_CVS:
        const cvs = await cacheAllCVs();
        return cvs && cvs.length > 0
          ? `All published CVs cached`
          : `No CVs cached`;

      case JOBS.JOB_TYPES.CREATE_CV_SEARCH_STRING:
        await createCVSearchString(data.candidatId);
        return `CV search string created for User ${data.candidatId}`;

      case JOBS.JOB_TYPES.SEND_MAIL:
        await sendMailBackground(data);
        return `Mail sent to '${JSON.stringify(data.toEmail)}' with template '${
          data.templateId
        }'`;

      case JOBS.JOB_TYPES.INSERT_AIRTABLE:
        await insertAirtable(data.tableName, data.fields);
        return `Airtable : insertion in '${data.tableName}'`;

      case JOBS.JOB_TYPES.UPDATE_AIRTABLE:
        await updateOpportunityAirtable(data.tableName, data.fields);
        return `Airtable : update in '${data.tableName}'`;

      case JOBS.JOB_TYPES.REMINDER_OFFER:
        const sentTo = await sendReminderMailAboutOffer(
          data.opportunityId,
          data.candidatId
        );
        return sentTo
          ? `Reminder about opportunity '${data.opportunityId}' sent to '${
              data.candidatId
            }' (${JSON.stringify(sentTo)})`
          : `No reminder about opportunity '${data.opportunityId}' sent to '${data.candidatId}'`;
      case JOBS.JOB_TYPES.GENERATE_CV_PREVIEW:
        const previewUrl = await generatePreview(
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
        return `Preview generated for User ${data.candidatId} : ${previewUrl}`;

      default:
        return `No process method for this job ${job.id} of type ${job.data.type}`;
    }
  });
};

throng({ workers, start });
