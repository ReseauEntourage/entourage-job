import { auth } from 'src/backend/controllers/Auth';
import { addToWorkQueue } from 'src/backend/jobs';
import { JOBS } from 'src/constants';
import { logger } from 'src/backend/utils/Logger';

import express from 'express';

const router = express.Router();

router.post('/contact-us', auth(), (req, res) => {
  // todo verification de champs
  const { firstName, lastName, phone, email, structure, message } = req.body;
  if (email && email.length > 0 && message && message.length > 0) {
    addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: process.env.MAILJET_CONTACT_EMAIL,
      subject: `Demande de contact`,
      html:
        `<strong>Prénom :</strong> ${firstName}<br />` +
        `<strong>Nom :</strong> ${lastName}<br />` +
        `<strong>Téléphone :</strong> ${phone || ''}<br />` +
        `<strong>Adresse mail :</strong> ${email}<br />` +
        `<strong>Structure :</strong> ${structure || ''}<br />` +
        `<strong>Message :</strong> ${message}`,
    })
      .then(() => {
        logger(res).log('mail: contact us sent');
        res.status(200).send('mail sent');
      })
      .catch((err) => {
        logger(res).error(err);
        res.status(500).send(err);
      });
  } else {
    res.status(500).send('Unvalid argument');
  }
});

export default router;