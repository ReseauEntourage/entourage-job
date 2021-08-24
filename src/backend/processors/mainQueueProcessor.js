import { JOBS, SOCKETS } from 'src/constants';
import { pusher } from 'src/backend/jobs';
import {
  generatePDF,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
} from 'src/backend/jobs/CV';
import {
  insertAirtable,
  updateOpportunityAirtable,
} from 'src/backend/jobs/Airtable';
import {
  sendMailBackground,
  sendReminderMailAboutOffer,
} from 'src/backend/jobs/Mail';

export default async (job) => {
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
      const toEmail =
        typeof data.toEmail === 'string' ? data.toEmail : data.toEmail.to;
      return `Mail sent to '${toEmail}' and subject '${data.subject}'`;

    case JOBS.JOB_TYPES.INSERT_AIRTABLE:
      await insertAirtable(data.tableName, data.fields);
      return `Airtable : insertion in '${data.tableName}'`;

    case JOBS.JOB_TYPES.UPDATE_AIRTABLE:
      await updateOpportunityAirtable(data.tableName, data.fields);
      return `Airtable : update in '${data.tableName}'`;

    case JOBS.JOB_TYPES.REMINDER_OFFER:
      const hasBeenSent = await sendReminderMailAboutOffer(
        data.opportunityId,
        data.candidatId
      );
      return hasBeenSent
        ? `Reminder about opportunity '${data.opportunityId}' sent to '${data.candidatId}'`
        : `No reminder about opportunity '${data.opportunityId}' sent to '${data.candidatId}'`;

    default:
      return `No process method for this job ${job.id} of type ${job.data.type}`;
  }
};
