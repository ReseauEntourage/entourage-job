import { auth } from 'src/backend/controllers/Auth';
import { addToWorkQueue } from 'src/backend/jobs';
import { JOBS, MAILJET_TEMPLATES } from 'src/constants';
import { logger } from 'src/backend/utils/Logger';

import express from 'express';
import _ from 'lodash';

const router = express.Router();

router.post('/contact-us', auth(), (req, res) => {
  // todo verification de champs
  const { firstName, lastName, phone, email, structure, message } = req.body;
  if (email && email.length > 0 && message && message.length > 0) {
    addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: process.env.MAILJET_CONTACT_EMAIL,
      subject: `Demande de contact`,
      templateId: MAILJET_TEMPLATES.CONTACT_FORM,
      variables: {
        ..._.omitBy(
          { firstName, lastName, phone, email, structure, message },
          _.isNil
        ),
      },
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
