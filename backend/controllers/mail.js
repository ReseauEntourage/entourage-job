const Mailjet = require('node-mailjet');

const mailjet = Mailjet.connect(
  process.env.MAILJET_PUB,
  process.env.MAILJET_SEC
);

const send = mailjet.post('send');

/**
 * Fonction permettant d'envoyer un mail
 * il est optionnel de remplir à la fois text et html
 */
const sendMail = ({ toEmail, subject, text, html }) => new Promise((res, rej) => {
  send.request({
    FromEmail: process.env.MAILJET_FROM_EMAIL,
    FromName: process.env.MAILJET_FROM_NAME,
    Recipients: [{ Email: toEmail }],
    Subject: subject,
    'Text-part': text,
    'HTML-part': html,
  }).then((result) => {
    res(result);
  }).catch((err) => {
    rej(err);
  });
});

module.exports = {
  sendMail,
};
