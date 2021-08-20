import { getAllCandidates } from 'src/backend/controllers/User';
import { getAllFilters } from 'src/utils/Filters';
import { sendMail } from 'src/backend/controllers/Mail';

import _ from 'lodash';

import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import {
  getLatestOpportunities,
  getOpportunity,
} from 'src/backend/controllers/Opportunity';

const sendMailBackground = async ({ toEmail, subject, text, html }) => {
  return sendMail({ toEmail, subject, text, html });
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
    const toEmail = {
      to: opportunity.userOpportunity.User.email,
      bcc: process.env.MAILJET_TO_EMAIL,
    };
    const candidatData = opportunity.userOpportunity.User.candidat;
    if (candidatData && candidatData.coach) {
      toEmail.cc = candidatData.coach.email;
    }
    await sendMail({
      toEmail,
      subject: "Rappel à propos d'une offre",
      html:
        'Bonjour,<br /><br />' +
        `Pour rappel, l'offre suivante vous a été adressée : <strong>${opportunity.title} - ${opportunity.company}</strong>.<br /><br />` +
        `Vous pouvez la consulter et mettre à jour son statut si nécessaire en cliquant ici :<br />` +
        `<strong>${process.env.SERVER_URL}/backoffice/candidat/offres?q=${opportunityId}</strong>.<br /><br />` +
        `L’équipe LinkedOut`,
    });
    return true;
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
        const offerList = zoneRecentOpportunities
          .map((opportunity) => {
            return `<li><a href="${process.env.SERVER_URL}/backoffice/candidat/offres?q=${opportunity.id}"><strong>${opportunity.title} - ${opportunity.company}</strong></a></li>`;
          })
          .join('');
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
            html:
              `Bonjour, <br /><br />` +
              `Voici les nouvelles offres adressées à tous les candidats${
                zone !== ADMIN_ZONES.HZ
                  ? ` de ${_.capitalize(zone)} et ses environs`
                  : ''
              } cette semaine. Retrouvez toutes les informations pour contacter ces recruteurs dans votre espace personnel.<br /><br />` +
              `<ul>${offerList}</ul><br /><br />` +
              `L’équipe LinkedOut`,
            toEmail: recipients,
            subject:
              'Les offres destinées à tous les candidats LinkedOut cette semaine',
          });
        }
      }
    }

    await sendMail(emails);
    return emails;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export { sendMailBackground, sendReminderMailAboutOffer, sendRecapAboutOffers };
