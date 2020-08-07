const express = require('express');

const router = express.Router();
const { auth } = require('../../../controllers/Auth');
const {
  models: {
    Message
  }
} = require('../../../db/models');
const { USER_ROLES } = require('../../../../constants');

// Find all messages
router.get('/', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), async (req, res) => {
  Message.findAll()
    .then((listeMessages) => {
      console.log('All Messages : ', JSON.stringify(listeMessages, null, 4));
      res.status(200).send(JSON.stringify(listeMessages, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Create a new message
router.post('/', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), async (req, res) => {
  Message.create({
    firstName: req.body.message.firstName,
    lastName: req.body.message.lastName,
    email: req.body.message.email,
    phone: req.body.message.phone,
    job: req.body.message.job,
    businessLine: req.body.message.businessLine,
    company: req.body.message.company,
    localization: req.body.message.localization,
    message: req.body.message.message,
  })
    .then((message) => {
      console.log('Message créé : ', message);
      res.status(200).send(message);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'SequelizeValidationError') {
        const errMessage = err.errors[0].message;
        res.status(403).send(errMessage);
      } else {
        res.status(401).send(err);
      }
    });
});

// Find 1 message req.params.id
router.get('/:id', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), async (req, res) => {
  Message.findAll({
    where: { id: req.params.id },
  })
    .then((message) => {
      console.log('Message found : ', JSON.stringify(message, null, 4));
      res.status(200).send(JSON.stringify(message, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Delete a message
router.delete('/:id', auth([USER_ROLES.ADMIN]), async (req, res) => {
  Message.destroy({
    where: { id: req.params.id },
  })
    .then(() => {
      console.log('Message destroy');
      res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

module.exports = router;
