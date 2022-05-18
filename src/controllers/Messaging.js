import Mailjet from 'node-mailjet';
import { MAILJET_TEMPLATES } from 'src/constants';
import _ from 'lodash';

import Vonage from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const mailjetMail = Mailjet.connect(
  process.env.MAILJET_PUB,
  process.env.MAILJET_SEC
);

const mailjetSMS = Mailjet.connect(process.env.MAILJET_SMS_TOKEN);

const sendMailjetMail = mailjetMail.post('send', { version: 'v3.1' });
const sendMailjetSMS = mailjetSMS.post('sms-send', { version: 'v4' });

const useSMS = process.env.USE_SMS === 'true';
const useMailjet = process.env.USE_MAILJET_SMS === 'true';

const createMail = ({
  toEmail,
  replyTo,
  subject,
  text,
  html,
  variables = {},
  templateId,
}) => {
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
        CustomCampaign:
          process.env.MAILJET_CAMPAIGNS_ACTIVATED === 'true'
            ? _.findKey(MAILJET_TEMPLATES, (id) => {
                return id === templateId;
              })
            : undefined,
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
    Headers: replyTo
      ? {
          'Reply-To': replyTo,
        }
      : undefined,
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
    sendMailjetMail
      .request(mailjetParams)
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

const createSMS = ({ toPhone, text }) => {
  if (typeof toPhone === 'string') {
    return useMailjet
      ? [
          {
            From: process.env.MAILJET_FROM_NAME,
            Text: text,
            To: toPhone,
          },
        ]
      : [{ toPhone, text }];
  } else if (Array.isArray(toPhone)) {
    return toPhone.map((phone) => {
      return useMailjet
        ? {
            From: process.env.MAILJET_FROM_NAME,
            Text: text,
            To: phone,
          }
        : { toPhone: phone, text };
    });
  }
};

const sendSMSWithVonage = ({ toPhone, text }) => {
  return new Promise((res, rej) => {
    vonage.message.sendSms(
      process.env.MAILJET_FROM_NAME,
      toPhone,
      text,
      {
        type: 'unicode',
      },
      (err, responseData) => {
        if (err) {
          rej(err);
        } else {
          if (responseData.messages[0]['status'] === '0') {
            res(responseData.messages[0]);
          } else {
            rej(responseData.messages[0]['error-text']);
          }
        }
      }
    );
  });
};

const sendSMSWithMailjet = (smsParams) => {
  return sendMailjetSMS.request(smsParams);
};

const sendSMS = (params) => {
  let smsToSend = [];
  if (Array.isArray(params)) {
    smsToSend = params.reduce((acc, curr) => {
      return [...acc, ...createSMS(curr)];
    }, []);
  } else {
    smsToSend = createSMS(params);
  }

  return new Promise((res, rej) => {
    Promise.all(
      smsToSend.map((smsParams) => {
        if (useSMS) {
          return useMailjet
            ? sendSMSWithMailjet(smsParams)
            : sendSMSWithVonage(smsParams);
        }
        return Promise.resolve();
      })
    )
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

export { sendMail, sendSMS };
