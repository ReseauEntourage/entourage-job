const Mailjet = require('node-mailjet').connect(
  process.env.MAILJET_PUB,
  process.env.MAILJET_SEC
);

const fromEmail = 'job@entourage.social';
const fromName = 'Entourage Jobs';

/*
we register a resource to perform multiple tasks
To learn more about the resources you can use, there is a well maintained
API reference: dev.mailjet.com
 */
const send = Mailjet.post('send');
const me = Mailjet.get('user');

me.request((error, response, body) => {
  console.log(response, error || body);
});

/**
 * Fonction permettant d'envoyer un mail
 * il est optionnel de remplir à la fois text et html
 */
const sendMail = ({ email, subject, text, html }) => {
  return send.request({
    FromEmail: fromEmail,
    FromName: fromName,
    Subject: subject,
    'Text-part': text,
    'HTML-part': html,
    Recipients: [{ Email: email }],
  });
};

module.exports = {
  sendMail,
};
