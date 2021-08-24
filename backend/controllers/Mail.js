const Mailjet = require('node-mailjet');

const mailjet = Mailjet.connect(
  process.env.MAILJET_PUB,
  process.env.MAILJET_SEC
);

const send = mailjet.post('send');

const createMail = (params) => {
  const { toEmail, subject, text, html } = params;
  const recipients = {};
  if (typeof toEmail === 'string') {
    recipients.Recipients = [{ Email: toEmail }];
  } else if (Array.isArray(toEmail)) {
    recipients.Recipients = toEmail.map((email) => {
      return { Email: email };
    });
  } else if (typeof toEmail === 'object') {
    if (toEmail.cc) {
      recipients.CC = toEmail.cc;
    }
    if (toEmail.to) {
      recipients.To = toEmail.to;
    }
    if (toEmail.bcc) {
      recipients.BCC = toEmail.bcc;
    }
  }
  return {
    FromEmail: process.env.MAILJET_FROM_EMAIL,
    FromName: process.env.MAILJET_FROM_NAME,
    Subject: subject,
    'Text-part': text,
    'HTML-part': html,
    ...recipients,
  };
};

/**
 * Fonction permettant d'envoyer un mail
 * il est optionnel de remplir à la fois text et html
 */
const sendMail = (params) => {
  let mailjetParams = { Messages: [] };
  if (Array.isArray(params)) {
    mailjetParams.Messages = params.map((p) => {
      return createMail(p);
    });
  } else {
    mailjetParams = createMail(params);
  }

  return new Promise((res, rej) => {
    send
      .request(mailjetParams)
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
