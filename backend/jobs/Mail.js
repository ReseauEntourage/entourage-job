const { sendMail } = require('../controllers/Mail');
const { getOpportunity } = require('../controllers/Opportunity');

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
    await sendMail({
      toEmail: {
        to: opportunity.userOpportunity.User.email,
        cc: opportunity.userOpportunity.User.candidat.coach.email,
        bcc: process.env.MAILJET_TO_EMAIL,
      },
      subject: "Rappel à propos d'une offre",
      html:
        'Bonjour,<br /><br />' +
        `Pour rappel, l'offre suivante vous a été adressé : <strong>${opportunity.title} - ${opportunity.company}</strong>.<br /><br />` +
        `Vous pouvez la consulter et mettre à jour le statut si nécessaire en cliquant ici :<br />` +
        `<strong>${process.env.SERVER_URL}/backoffice/candidat/offres?q=${opportunityId}</strong>.<br /><br />` +
        `L’équipe LinkedOut`,
    });
    return true;
  }
  return false;
};

module.exports = {
  sendMailBackground,
  sendReminderMailAboutOffer,
};
