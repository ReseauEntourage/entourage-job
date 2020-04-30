const Mailjet = require('node-mailjet');
const Airtable = require('airtable');

const mailjet = Mailjet.connect(
  process.env.MAILJET_PUB,
  process.env.MAILJET_SEC
);

const send = mailjet.post('send');

const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE);

const sendMail = ({subject, text, html}) => new Promise((res, rej) => {
  send.request({
    FromEmail: process.env.MAILJET_FROM_EMAIL,
    FromName: process.env.MAILJET_FROM_NAME,
    Recipients: [{Email: process.env.MAILJET_TO_EMAIL}],
    Subject: subject,
    'Text-part': text,
    'HTML-part': html,
  }).then((mailjetRes) => {
    // console.log(mailjetRes);
    res();
  }).catch((mailjetErr) => {
    // console.log(mailjetErr);
    rej();
  });
});

module.exports.sendContactInfoByMail = (event, context, callback) => {
  const res = {};

  const contactDetails = (typeof event.body === "object") ? event.body : JSON.parse(event.body);

  if (contactDetails.security === "") {
    delete contactDetails.security;
    const emailObject = {
      subject: "Vendée Globe - Formulaire de contact ⛵️",
      text: "Nouvelle demande de contact concernant le Vendée Globe :\n\n" +
        `Nom : ${contactDetails.name || ''}\n` +
        `Statut : ${contactDetails.status || ''}\n` +
        `Organisation : ${contactDetails.organisation || ''}\n` +
        `Mail : ${contactDetails.mail || ''}\n` +
        `Téléphone : ${contactDetails.telephone || ''}\n` +
        `Message : ${contactDetails.message || ''}\n`
    };
    sendMail(emailObject).then(() => {
      base('Réponses').create([
        {
          "fields": {
            "Nom & Prénom": contactDetails.name || '',
            "Status": contactDetails.status || '',
            "Organisation": contactDetails.organisation || '',
            "Email": contactDetails.mail || '',
            "Numéro de téléphone": contactDetails.telephone || '',
            "Message": contactDetails.message || ''
          }
        }
      ], (err, records) => {
        if (err) {
          res.statusCode = 500;
          res.body = JSON.stringify({message: "Mail sent but table failed to get updated."});
          callback(null, res);
        } else {
          res.statusCode = 200;
          res.headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          };
          res.body = JSON.stringify({message: "Mail sent and table updated !"});
        }

      });
    }).catch(() => {
      res.statusCode = 500;
      res.body = JSON.stringify({message: "Mail failed to send and table failed to get updated."});
      callback(null, res);
    })
  } else {
    res.statusCode = 400;
    res.body = JSON.stringify({
      message: "Form values not correct.",
      debug_forms: contactDetails
    });
    callback(null, res);
  }
};
