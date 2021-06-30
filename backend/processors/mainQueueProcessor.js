const loadEnvironementVariables = require('../utils/env');

loadEnvironementVariables();

const { JOBS, SOCKETS } = require('../../constants');
const {
  generatePDF,
  cacheCV,
  cacheAllCVs,
  createCVSearchString,
  sendMailBackground,
  insertAirtable,
  updateOpportunityAirtable,
  pusher,
} = require('../jobs');

module.exports = async (job) => {
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
      return `Mail sent to '${data.toEmail}' and subject '${data.subject}'`;

    case JOBS.JOB_TYPES.INSERT_AIRTABLE:
      await insertAirtable(data.tableName, data.fields);
      return `Airtable : insertion in '${data.tableName}'`;

    case JOBS.JOB_TYPES.UPDATE_AIRTABLE:
      await updateOpportunityAirtable(data.tableName, data.fields);
      return `Airtable : update in '${data.tableName}'`;

    default:
      return `No process method for this job ${job.id} of type ${job.data.type}`;
  }
};
