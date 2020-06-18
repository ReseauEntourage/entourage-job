const express = require('express');

const router = express.Router();
const sequelize = require('sequelize');
const db = require('../../../db/config/databaseConnect');
const { auth } = require('../../../controllers/Auth');
const Message = require('../../../db/models/message')(db, sequelize.DataTypes);

// Find all messages
router.get('/', auth.required, (req, res) => {
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
router.post('/', auth.required, (req, res) => {
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
router.get('/:id', auth.required, (req, res) => {
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
router.delete('/:id', auth.required, (req, res) => {
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
