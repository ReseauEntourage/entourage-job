import Mailjet from 'node-mailjet';

const mailjet = Mailjet.connect(
  process.env.MAILJET_PUB,
  process.env.MAILJET_SEC
);

const send = mailjet.post('send', { version: 'v3.1' });

const createMail = (params) => {
  const { toEmail, subject, text, html, variables = {}, templateId } = params;
  const recipients = {};
  if (typeof toEmail === 'string') {
    recipients.To = [{ Email: toEmail }];
  } else if (Array.isArray(toEmail)) {
    recipients.To = toEmail.map((email) => {
      return { Email: email };
    });
  } else if (typeof toEmail === 'object') {
    if (toEmail.cc) {
      recipients.Cc = Array.isArray(toEmail.cc)
        ? toEmail.cc.map((email) => {
            return { Email: email };
          })
        : [{ Email: toEmail.cc }];
    }
    if (toEmail.to) {
      recipients.To = Array.isArray(toEmail.to)
        ? toEmail.to.map((email) => {
            return { Email: email };
          })
        : [{ Email: toEmail.to }];
    }
    if (toEmail.bcc) {
      recipients.Bcc = Array.isArray(toEmail.bcc)
        ? toEmail.bcc.map((email) => {
            return { Email: email };
          })
        : [{ Email: toEmail.bcc }];
    }
  }
  const content = templateId
    ? {
        Variables: {
          siteLink: process.env.FRONT_URL,
          ...variables,
        },
        TemplateID: templateId,
        TemplateLanguage: true,
        TemplateErrorReporting: {
          Email: process.env.MAILJET_SUPPORT_EMAIL,
          Name: process.env.MAILJET_FROM_NAME,
        },
      }
    : {
        'Text-part': text,
        'HTML-part': html,
      };
  return {
    From: {
      Email: process.env.MAILJET_FROM_EMAIL,
      Name: process.env.MAILJET_FROM_NAME,
    },
    Subject: subject,
    ...recipients,
    ...content,
  };
};

/**
 * Fonction permettant d'envoyer un mail
 * il est optionnel de remplir à la fois text et html
 */
const sendMail = (params) => {
  const mailjetParams = { Messages: [] };
  if (Array.isArray(params)) {
    mailjetParams.Messages = params.map((p) => {
      return createMail(p);
    });
  } else {
    mailjetParams.Messages = [createMail(params)];
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

export { sendMail };
