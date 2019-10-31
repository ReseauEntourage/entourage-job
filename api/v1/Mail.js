const express = require('express');

const router = express.Router();
const mailjet = require('../../mailjet');

router.post('/', (req, res) => {
  // todo verification de champs
  const { email, subject, text, html } = req.body;
  if (
    email &&
    email.length > 0 &&
    (subject && subject.length > 0) &&
    ((text && text.length > 0) || (html && html.length > 0))
  ) {
    mailjet
      .sendMail({
        email,
        subject,
        text,
        html,
      })
      .then((value) => {
        console.log("Mail envoyé à l'adresse: ", req.body.email);
        res.status(200).send(value);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  } else {
    res.status(500).send('Unvalid argument');
  }
});

module.exports = router;
