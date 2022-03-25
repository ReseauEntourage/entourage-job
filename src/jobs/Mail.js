import {
  getAllPublishedCandidates,
  getMembers,
  getUser,
  sendMailsAfterCreate,
} from 'src/controllers/User';
import { sendMail } from 'src/controllers/Mail';

import _ from 'lodash';

import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import {
  getExternalOpportunitiesCreatedByUserCount,
  getLatestOpportunities,
  getOpportunity,
} from 'src/controllers/Opportunity';
import { CV_STATUS, JOBS, MAILJET_TEMPLATES, USER_ROLES } from 'src/constants';
import { getRelatedUser, getZoneSuffix } from 'src/utils/Finding';
import { addToWorkQueue } from 'src/jobs';
import { getAllUserCVsVersions } from 'src/controllers/CV';

const sendMailBackground = async (params) => {
  return sendMail(params);
};

const sendReminderMailAboutOffer = async (opportunityId, candidatId) => {
  const opportunity = await getOpportunity(opportunityId, false, candidatId);
  if (
    opportunity &&
    Object.keys(opportunity).length > 0 &&
    opportunity.isPublic === false &&
    (!opportunity.userOpportunity.seen ||
      opportunity.userOpportunity.status < 0)
  ) {
    const candidatData = opportunity.userOpportunity.User;

    const toEmail = {
      to: candidatData.email,
      bcc: [
        process.env[`ADMIN_CANDIDATES_${getZoneSuffix(candidatData.zone)}`],
        process.env[`ADMIN_COMPANIES_${getZoneSuffix(candidatData.zone)}`],
      ],
    };
    const coach = getRelatedUser(candidatData);
    if (coach) {
      toEmail.cc = coach.email;
    }

    await sendMail({
      toEmail,
      templateId: MAILJET_TEMPLATES.OFFER_REMINDER,
      variables: {
        offer: _.omitBy(opportunity, _.isNil),
        candidat: _.omitBy(candidatData, _.isNil),
      },
    });
    return toEmail;
  }
  return false;
};

const sendReminderMailAboutCV = async (candidatId) => {
  const user = await getUser(candidatId);
  const cvs = await getAllUserCVsVersions(candidatId);
  if (cvs && cvs.length > 0) {
    const hasSubmittedAtLeastOnce = cvs.some(({ status }) => {
      return status === CV_STATUS.Pending;
    });

    if (!hasSubmittedAtLeastOnce) {
      const toEmail = {
        to: user.email,
      };
      const coach = getRelatedUser(user);
      if (coach) {
        toEmail.cc = coach.email;
      }

      await sendMail({
        toEmail,
        templateId: MAILJET_TEMPLATES.CV_REMINDER_10,
        variables: {
          ..._.omitBy(user.toJSON(), _.isNil),
        },
      });
      return toEmail;
    }
  }
  return false;
};

const sendReminderIfEmployed = async (candidatId, templateId) => {
  const user = await getUser(candidatId);
  if (!user.candidat.employed) {
    const toEmail = {
      to: user.email,
    };
    const coach = getRelatedUser(user);
    if (coach) {
      toEmail.cc = coach.email;
    }

    await sendMail({
      toEmail,
      templateId: templateId,
      variables: {
        ..._.omitBy(user.toJSON(), _.isNil),
      },
    });
    return toEmail;
  }
  return false;
};

const sendReminderAboutVideo = async (candidatId) => {
  return sendReminderIfEmployed(candidatId, MAILJET_TEMPLATES.VIDEO_REMINDER);
};

const sendReminderAboutActions = async (candidatId) => {
  return sendReminderIfEmployed(candidatId, MAILJET_TEMPLATES.ACTIONS_REMINDER);
};

const sendReminderAboutExternalOffers = async (candidatId) => {
  const user = await getUser(candidatId);
  if (!user.candidat.employed) {
    const toEmail = {
      to: user.email,
    };

    let opportunitiesCreatedByCandidateOrCoach =
      await getExternalOpportunitiesCreatedByUserCount(candidatId);

    const coach = getRelatedUser(user);
    if (coach) {
      toEmail.cc = coach.email;
      opportunitiesCreatedByCandidateOrCoach +=
        await getExternalOpportunitiesCreatedByUserCount(coach.id);
    }

    if (opportunitiesCreatedByCandidateOrCoach === 0) {
      await sendMail({
        toEmail,
        templateId: MAILJET_TEMPLATES.EXTERNAL_OFFERS_REMINDER,
        variables: {
          ..._.omitBy(user.toJSON(), _.isNil),
        },
      });
      return toEmail;
    }
  }
  return false;
};

const sendMailsToOldUsers = async () => {
  const publishedCandidates = await getAllPublishedCandidates();
  const members = await getMembers({
    role: USER_ROLES.CANDIDAT,
    hidden: ['false'],
    employed: ['false'],
  });
  const filteredMembers = members.filter(({ id: memberId }) => {
    return !publishedCandidates
      .map(({ id }) => {
        return id;
      })
      .includes(memberId);
  });
  await Promise.all(
    filteredMembers.map(({ id }) => {
      return sendMailsAfterCreate(id);
    })
  );
};

const sendRecapAboutOffers = async () => {
  try {
    const adminZonesKeys = Object.keys(ADMIN_ZONES);
    const opportunities = await getLatestOpportunities();
    const publishedCandidates = await getAllPublishedCandidates();
    let emails = [];

    for (let i = 0; i < adminZonesKeys.length; i += 1) {
      const zone = ADMIN_ZONES[adminZonesKeys[i]];
      const zoneFilters = _.map(
        DEPARTMENTS_FILTERS.filter((filter) => {
          return !filter.zone || filter.zone === zone;
        }),
        (zoneFilter) => {
          return zoneFilter.value;
        }
      );
      const zoneRecentOpportunities = opportunities.filter((opportunity) => {
        return (
          zoneFilters.some((zoneFilter) => {
            return zoneFilter === opportunity.department;
          }) ||
          (zone === ADMIN_ZONES.HZ && !opportunity.department)
        );
      });

      if (zoneRecentOpportunities.length > 0) {
        const zoneCandidates = publishedCandidates.filter((candidate) => {
          return (
            candidate.zone === zone ||
            (zone === ADMIN_ZONES.HZ && !candidate.zone)
          );
        });

        const recipients = _.reduce(
          zoneCandidates,
          (acc, curr) => {
            const coachEmail = [];

            const coach = getRelatedUser(curr);
            if (coach) {
              coachEmail.push(coach.email);
            }
            return [...acc, curr.email, ...coachEmail];
          },
          []
        );

        if (recipients.length > 0) {
          emails = recipients.map((recipient) => {
            return {
              toEmail: recipient,
              templateId: MAILJET_TEMPLATES.OFFERS_RECAP,
              variables: {
                zone: _.capitalize(zone),
                offerList: zoneRecentOpportunities,
              },
            };
          });
        }
      }
    }

    if (emails.length > 0) {
      await addToWorkQueue({
        type: JOBS.JOB_TYPES.SEND_MAIL,
        mails: emails,
      });
    }
    return emails;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export {
  sendMailBackground,
  sendReminderMailAboutOffer,
  sendReminderMailAboutCV,
  sendRecapAboutOffers,
  sendReminderAboutVideo,
  sendReminderAboutActions,
  sendReminderAboutExternalOffers,
  sendMailsToOldUsers,
};
