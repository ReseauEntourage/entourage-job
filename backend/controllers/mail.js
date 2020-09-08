const Mailjet = require('node-mailjet');

const mailjet = Mailjet.connect(
  process.env.MAILJET_PUB,
  process.env.MAILJET_SEC
);

/*
we register a resource to perform multiple tasks
To learn more about the resources you can use, there is a well maintained
API reference: dev.mailjet.com
 */
const send = mailjet.post('send');
const me = mailjet.get('user');

// me.request((error, response, body) => {
//   console.log(response, error || body);
// });

/**
 * Fonction permettant d'envoyer un mail
 * il est optionnel de remplir à la fois text et html
 */
const sendMail = async ({toEmail, subject, text, html}) => {
  const res = await send.request({
    FromEmail: process.env.MAILJET_FROM_EMAIL,
    FromName: process.env.MAILJET_FROM_NAME,
    Recipients: [{Email: toEmail}],
    Subject: subject,
    'Text-part': text,
    'HTML-part': html,
  });
  console.log(
    `# Email sent`,
    `- from: ${process.env.MAILJET_FROM_EMAIL})`,
    `- to: ${toEmail}`,
    `- subject: ${subject}`
  );
  return res;
};

module.exports = {
  sendMail,
};
