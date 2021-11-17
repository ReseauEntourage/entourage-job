import { getAllCandidates } from 'src/backend/controllers/User';
import { getAllFilters } from 'src/utils/Filters';
import { sendMail } from 'src/backend/controllers/Mail';

import _ from 'lodash';

import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import {
  getLatestOpportunities,
  getOpportunity,
} from 'src/backend/controllers/Opportunity';
import { JOBS, MAILJET_TEMPLATES } from 'src/constants';
import { getZoneSuffix } from 'src/utils';
import { addToWorkQueue } from './index';

const sendMailBackground = async ({
  toEmail,
  subject,
  text,
  html,
  variables,
  templateId,
}) => {
  return sendMail({ toEmail, subject, text, html, variables, templateId });
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
    if (candidatData.candidat && candidatData.candidat.coach) {
      toEmail.cc = candidatData.candidat.coach.email;
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

const sendRecapAboutOffers = async () => {
  try {
    const adminZonesKeys = Object.keys(ADMIN_ZONES);
    const opportunities = await getLatestOpportunities();
    const candidates = await getAllCandidates();
    const emails = [];

    for (let i = 0; i < adminZonesKeys.length; i += 1) {
      const zone = ADMIN_ZONES[adminZonesKeys[i]];
      const zoneFilters = _.map(
        getAllFilters(DEPARTMENTS_FILTERS, zone),
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
        const zoneCandidates = candidates.filter((candidate) => {
          return (
            candidate.zone === zone ||
            (zone === ADMIN_ZONES.HZ && !candidate.zone)
          );
        });

        const recipients = _.reduce(
          zoneCandidates,
          (acc, curr) => {
            const coachEmail = [];
            if (curr.candidat && curr.candidat.coach) {
              coachEmail.push(curr.candidat.coach.email);
            }
            return [...acc, curr.email, ...coachEmail];
          },
          []
        );

        if (recipients.length > 0) {
          emails.push({
            toEmail: recipients,
            templateId: MAILJET_TEMPLATES.OFFERS_RECAP,
            variables: {
              zone: _.capitalize(zone),
              offerList: zoneRecentOpportunities,
            },
          });
        }
      }
    }

    if (emails.length > 0) {
      await Promise.all(
        emails.map((email) => {
          return addToWorkQueue({
            type: JOBS.JOB_TYPES.SEND_MAIL,
            ...email,
          });
        })
      );
    }
    return emails;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export { sendMailBackground, sendReminderMailAboutOffer, sendRecapAboutOffers };
