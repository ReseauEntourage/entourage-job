import { getUser } from 'src/controllers/User';
import { sendMail, sendSMS } from 'src/controllers/Messaging';

import _ from 'lodash';

import {
  getExternalOpportunitiesCreatedByUserCount,
  getOpportunity,
} from 'src/controllers/Opportunity';
import { CV_STATUS, MAILJET_TEMPLATES } from 'src/constants';
import {
  getAdminMailsFromZone,
  getRelatedUser,
  getZoneFromDepartment,
} from 'src/utils/Finding';
import { getAllUserCVsVersions } from 'src/controllers/CV';
import moment from 'moment';
import { isValidPhone } from 'src/utils/PhoneFormatting';
import { getShortenedOfferURL } from 'src/utils/Mutating';
import { getMailjetVariablesForPrivateOrPublicOffer } from 'src/utils/Mailjet';

const sendMailBackground = async (params) => {
  return sendMail(params);
};

const sendSMSBackground = async (params) => {
  return sendSMS(params);
};

const sendReminderAboutOffer = async (opportunityId, candidatId) => {
  const opportunity = await getOpportunity(opportunityId, false, candidatId);
  if (
    opportunity &&
    Object.keys(opportunity).length > 0 &&
    opportunity.isPublic === false &&
    (!opportunity.userOpportunity.seen ||
      opportunity.userOpportunity.status < 0)
  ) {
    const candidatData = opportunity.userOpportunity.User;

    const { candidatesAdminMail, companiesAdminMail } = getAdminMailsFromZone(
      candidatData.zone
    );

    const toEmail = {
      to: candidatData.email,
      bcc: [candidatesAdminMail, companiesAdminMail],
    };

    const coach = getRelatedUser(candidatData);
    if (coach) {
      toEmail.cc = coach.email;
    }

    await sendMail({
      toEmail,
      templateId: MAILJET_TEMPLATES.OFFER_REMINDER,
      replyTo: candidatesAdminMail,
      variables: {
        offer: _.omitBy(opportunity, _.isNil),
        candidat: _.omitBy(candidatData, _.isNil),
      },
    });

    try {
      const candidatPhone = candidatData?.phone;
      if (candidatPhone && isValidPhone(candidatPhone)) {
        await sendSMS({
          toPhone: candidatPhone,
          text: `Bonjour,\nIl y a 5 jours un recruteur vous a personnellement adressé une offre. Consultez-la ici et traitez-la avec votre coach: ${await getShortenedOfferURL(
            opportunity.id,
            _.findKey(MAILJET_TEMPLATES, (id) => {
              return id === MAILJET_TEMPLATES.OFFER_REMINDER;
            })
          )}`,
        });
      }
    } catch (err) {
      console.error(err);
    }
    return toEmail;
  }
  return false;
};

const sendNoResponseOffer = async (opportunityId) => {
  const opportunity = await getOpportunity(opportunityId, true);
  if (opportunity) {
    const allStatus = opportunity.userOpportunity.map(({ status }) => {
      return status;
    });

    if (
      allStatus.every((status) => {
        return status < 0;
      })
    ) {
      const toEmail = {
        to: opportunity.contactMail || opportunity.recruiterMail,
        bcc: process.env[
          `ADMIN_COMPANIES_${getZoneFromDepartment(opportunity.department)}`
        ],
      };

      await sendMail({
        toEmail,
        templateId: opportunity.isPublic
          ? MAILJET_TEMPLATES.OFFER_PUBLIC_NO_RESPONSE
          : MAILJET_TEMPLATES.OFFER_PRIVATE_NO_RESPONSE,
        replyTo:
          process.env[
            `ADMIN_COMPANIES_${getZoneFromDepartment(opportunity.department)}`
          ],
        variables: getMailjetVariablesForPrivateOrPublicOffer(opportunity),
      });

      return toEmail;
    }
  }

  return false;
};

const sendReminderAboutCV = async (candidatId, is20Days) => {
  const firstOfMarch2022 = '2022-03-01';
  const user = await getUser(candidatId);
  if (moment(user.createdAt).isAfter(moment(firstOfMarch2022, 'YYYY-MM-DD'))) {
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
        const { candidatesAdminMail } = getAdminMailsFromZone(user.zonee);

        await sendMail({
          toEmail,
          templateId: is20Days
            ? MAILJET_TEMPLATES.CV_REMINDER_20
            : MAILJET_TEMPLATES.CV_REMINDER_10,
          replyTo: candidatesAdminMail,
          variables: {
            ..._.omitBy(user.toJSON(), _.isNil),
          },
        });
        return toEmail;
      }
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
    const { candidatesAdminMail } = getAdminMailsFromZone(user.zone);

    await sendMail({
      toEmail,
      templateId: templateId,
      replyTo: candidatesAdminMail,
      variables: {
        ..._.omitBy(user.toJSON(), _.isNil),
      },
    });
    return toEmail;
  }
  return false;
};

const sendReminderAboutInterviewTraining = async (candidatId) => {
  return sendReminderIfEmployed(
    candidatId,
    MAILJET_TEMPLATES.INTERVIEW_TRAINING_REMINDER
  );
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
    const { candidatesAdminMail } = getAdminMailsFromZone(user.zone);

    if (opportunitiesCreatedByCandidateOrCoach === 0) {
      await sendMail({
        toEmail,
        templateId: MAILJET_TEMPLATES.EXTERNAL_OFFERS_REMINDER,
        replyTo: candidatesAdminMail,
        variables: {
          ..._.omitBy(user.toJSON(), _.isNil),
        },
      });
      return toEmail;
    }
  }
  return false;
};

export {
  sendMailBackground,
  sendSMSBackground,
  sendReminderAboutOffer,
  sendReminderAboutCV,
  sendNoResponseOffer,
  sendReminderAboutInterviewTraining,
  sendReminderAboutVideo,
  sendReminderAboutActions,
  sendReminderAboutExternalOffers,
};
