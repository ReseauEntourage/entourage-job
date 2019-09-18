const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const db = require("../../db/config/databaseConnect");
const CV = require("../../db/models/cv")(db, sequelize.DataTypes);
const moment = require("moment");


// Find all CVs
router.get('/', (req, res) => {
  console.log("Hello ", CV);
  CV.findAll()
    .then((listeCV) => {
      console.log("All CVs : ", JSON.stringify(listeCV, null, 4));
      res.status(200).send(JSON.stringify(listeCV, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Create a new user
router.post('/', (req, res) => {
  CV.create({
    firstname: req.body.firstname || req.body.firstName,
    lastname: req.body.lastname || req.body.lastName,
  })
    .then((cv) => {
      console.log("CV créé : ", cv);
      res.status(200).send(cv);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Find 1 CV  req.params.id
router.get('/:id', (req, res) => {
  CV.findAll({
    where: { id: req.params.id }
  })
    .then((cv) => {
      console.log("CV found : ", JSON.stringify(cv, null, 4));
      res.status(200).send(JSON.stringify(cv, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Update a CV
router.put('/:id', (req, res) => {
  CV.update({
    firstname: req.body.firstname || req.body.firstName,
    lastname: req.body.lastname || req.body.lastName,
    modified_date: moment(new Date()),
  }, {
    where: { id: req.params.id }
  })
    .then((cv) => {
      console.log("CV updated : ", JSON.stringify(cv, null, 4));
      res.status(200).send(JSON.stringify(cv, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Delete a CV
router.delete('/:id', (req, res) => {
  CV.destroy({
    where: { id: req.params.id }
  })
    .then(() => {
      console.log("CV destroy");
      res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

module.exports = router;