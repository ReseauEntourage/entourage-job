import { getMainWorkQueue } from 'src/utils/WorkQueue';

import throng from 'throng';

import { attachListeners, maxJobsPerWorker, pusher, workers } from 'src/jobs';
import { JOBS, SOCKETS } from 'src/constants';
import {
  sendMailBackground,
  sendReminderAboutActions,
  sendReminderAboutExternalOffers,
  sendReminderAboutVideo,
  sendReminderAboutCV,
  sendReminderAboutOffer,
  sendSMSBackground,
  sendNoResponseOffer,
  sendReminderAboutInterviewTraining,
} from 'src/jobs/Messaging';
import {
  cacheAllCVs,
  cacheCV,
  createCVSearchString,
  generatePDF,
} from 'src/jobs/CV';
import { insertAirtable, updateOpportunityAirtable } from 'src/jobs/Airtable';
import { generatePreview } from 'src/jobs/Image';
import _ from 'lodash';

const start = () => {
  const workQueue = getMainWorkQueue();

  attachListeners(workQueue);

  workQueue.process(maxJobsPerWorker, async (job) => {
    const {
      data: { type, ...data },
    } = job;

    switch (type) {
      case JOBS.JOB_TYPES.GENERATE_CV_PDF: {
        await generatePDF(data.candidatId, data.token, data.paths);
        await pusher.trigger(
          SOCKETS.CHANNEL_NAMES.CV_PDF,
          SOCKETS.EVENTS.CV_PDF_DONE,
          {
            candidatId: data.candidatId,
          }
        );
        return `PDF generated for User ${data.candidatId} : ${data.paths[2]}`;
      }

      case JOBS.JOB_TYPES.CACHE_CV: {
        const cv = await cacheCV(data.url, data.candidatId);
        return cv
          ? `CV cached for User ${cv.UserId} and CV ${cv.id}${
              data.url ? ` and URL ${data.url}` : ''
            }`
          : `CV not cached`;
      }

      case JOBS.JOB_TYPES.CACHE_ALL_CVS: {
        const cvs = await cacheAllCVs();
        return cvs && cvs.length > 0
          ? `All published CVs cached`
          : `No CVs cached`;
      }

      case JOBS.JOB_TYPES.CREATE_CV_SEARCH_STRING: {
        await createCVSearchString(data.candidatId);
        return `CV search string created for User ${data.candidatId}`;
      }

      case JOBS.JOB_TYPES.SEND_MAIL: {
        let mails = [data];
        if (data.mails && Array.isArray(data.mails)) {
          mails = data.mails;
        }
        await sendMailBackground(mails);
        return `Mail sent to '${JSON.stringify(
          mails.map(({ toEmail }) => {
            return toEmail;
          })
        )}' with template '${_.uniq(
          mails.map(({ templateId }) => {
            return templateId;
          })
        )}'`;
      }

      case JOBS.JOB_TYPES.SEND_SMS: {
        let phones = [data];
        if (data.phones && Array.isArray(data.phones)) {
          phones = data.phones;
        }
        await sendSMSBackground(phones);
        return `SMS sent to '${JSON.stringify(
          phones.map(({ toPhone }) => {
            return toPhone;
          })
        )}'`;
      }

      case JOBS.JOB_TYPES.INSERT_AIRTABLE: {
        await insertAirtable(data.tableName, data.fields);
        return `Airtable : insertion in '${data.tableName}'`;
      }

      case JOBS.JOB_TYPES.UPDATE_AIRTABLE: {
        await updateOpportunityAirtable(data.tableName, data.fields);
        return `Airtable : update in '${data.tableName}'`;
      }

      case JOBS.JOB_TYPES.REMINDER_OFFER: {
        const sentToReminderOffer = await sendReminderAboutOffer(
          data.opportunityId,
          data.candidatId
        );
        return sentToReminderOffer
          ? `Reminder about opportunity '${data.opportunityId}' sent to '${
              data.candidatId
            }' (${JSON.stringify(sentToReminderOffer)})`
          : `No reminder about opportunity '${data.opportunityId}' sent to '${data.candidatId}'`;
      }

      case JOBS.JOB_TYPES.NO_RESPONSE_OFFER: {
        const sentToNoResponseOffer = await sendNoResponseOffer(
          data.opportunityId
        );
        return sentToNoResponseOffer
          ? `Mail sent to recruiter because no response on opportunity '${
              data.opportunityId
            }' (${JSON.stringify(sentToNoResponseOffer)})`
          : `No mail sent to recruiter because no response on opportunity '${data.opportunityId}'`;
      }

      case JOBS.JOB_TYPES.REMINDER_CV_10: {
        const sentToReminderCV10 = await sendReminderAboutCV(data.candidatId);
        return sentToReminderCV10
          ? `Reminder about CV after 10 days sent to '${
              data.candidatId
            }' (${JSON.stringify(sentToReminderCV10)})`
          : `No reminder after 10 about CV sent to '${data.candidatId}'`;
      }
      case JOBS.JOB_TYPES.REMINDER_CV_20: {
        const sentToReminderCV20 = await sendReminderAboutCV(
          data.candidatId,
          true
        );
        return sentToReminderCV20
          ? `Reminder about CV after 20 days sent to '${
              data.candidatId
            }' (${JSON.stringify(sentToReminderCV20)})`
          : `No reminder after 20 day about CV sent to '${data.candidatId}'`;
      }

      case JOBS.JOB_TYPES.REMINDER_VIDEO: {
        const sentToReminderVideo = await sendReminderAboutVideo(
          data.candidatId
        );
        return sentToReminderVideo
          ? `Reminder about video sent to '${
              data.candidatId
            }' (${JSON.stringify(sentToReminderVideo)})`
          : `No reminder about video sent to '${data.candidatId}'`;
      }
      case JOBS.JOB_TYPES.REMINDER_INTERVIEW_TRAINING: {
        const sentToReminderTraining = await sendReminderAboutInterviewTraining(
          data.candidatId
        );
        return sentToReminderTraining
          ? `Reminder about interview training sent to '${
              data.candidatId
            }' (${JSON.stringify(sentToReminderTraining)})`
          : `No reminder about interview training sent to '${data.candidatId}'`;
      }
      case JOBS.JOB_TYPES.REMINDER_ACTIONS: {
        const sentToReminderActions = await sendReminderAboutActions(
          data.candidatId
        );
        return sentToReminderActions
          ? `Reminder about actions sent to '${
              data.candidatId
            }' (${JSON.stringify(sentToReminderActions)})`
          : `No reminder about actions sent to '${data.candidatId}'`;
      }

      case JOBS.JOB_TYPES.REMINDER_EXTERNAL_OFFERS: {
        const sentToReminderExternalOffers =
          await sendReminderAboutExternalOffers(data.candidatId);
        return sentToReminderExternalOffers
          ? `Reminder about external offers sent to '${
              data.candidatId
            }' (${JSON.stringify(sentToReminderExternalOffers)})`
          : `No reminder about external offers sent to '${data.candidatId}'`;
      }

      case JOBS.JOB_TYPES.GENERATE_CV_PREVIEW: {
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
      }

      default: {
        return `No process method for this job ${job.id} of type ${type}`;
      }
    }
  });
};

throng({ workers, start });
