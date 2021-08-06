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
const sendMail = ({ toEmail, subject, text, html }) => {
  const recipients = {};
  if (typeof toEmail === 'object') {
    if (toEmail.cc) {
      recipients.CC = toEmail.cc;
    }
    if (toEmail.to) {
      recipients.To = toEmail.to;
    }
    if (toEmail.bcc) {
      recipients.BCC = toEmail.bcc;
    }
  } else {
    recipients.Recipients = [{ Email: toEmail }];
  }
  return new Promise((res, rej) => {
    send
      .request({
        FromEmail: process.env.MAILJET_FROM_EMAIL,
        FromName: process.env.MAILJET_FROM_NAME,
        Subject: subject,
        'Text-part': text,
        'HTML-part': html,
        ...recipients,
      })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

module.exports = {
  sendMail,
};
