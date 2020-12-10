const express = require('express');

const router = express.Router();
const { auth } = require('../../../controllers/Auth');
const { addToWorkQueue } = require('../../../jobs');
const { JOBS } = require('../../../../constants');

router.post('/contact-us', auth(), (req, res) => {
  // todo verification de champs
  const { firstName, lastName, phone, email, structure, message } = req.body;
  if (email && email.length > 0 && message && message.length > 0) {
    addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: process.env.MAILJET_CONTACT_EMAIL,
      subject: `LinkedOut - Contact`,
      text: `Prénom : ${firstName}\nNom : ${lastName}\nTéléphone : ${
        phone || ''
      }\nAdresse mail : ${email}\nStructure : ${
        structure || ''
      }\nMessage : ${message}`,
    })
      .then((value) => {
        res.locals.logger.log('mail: contact us sent');
        res.status(200).send('mail sent');
      })
      .catch((err) => {
        res.locals.logger.error(err);
        res.status(500).send(err);
      });
  } else {
    res.status(500).send('Unvalid argument');
  }
});

module.exports = router;
