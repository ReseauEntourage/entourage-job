const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const db = require("../../db/config/databaseConnect");
const CV_Skill = require("../../db/models/cv_skill")(db, sequelize.DataTypes);
const moment = require("moment");


// Find all CV_Skills
router.get('/', (req, res) => {
  console.log("Hello ", CV_Skill);
  CV_Skill.findAll()
    .then((listeCV_Skill) => {
      console.log("All CV_Skills : ", JSON.stringify(listeCV_Skill, null, 4));
      res.status(200).send(JSON.stringify(listeCV_Skill, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Create a new user
router.post('/', (req, res) => {
  CV_Skill.create({
    name: req.body.firstname || req.body.firstName,
    CVid: "14b95998-e018-4e81-9c70-d7c784861fe5"
  })
    .then((cv_skill) => {
      console.log("CV_Skill créé : ", cv_skill);
      res.status(200).send(cv_skill);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Find 1 CV_Skill  req.params.id
router.get('/:id', (req, res) => {
  CV_Skill.findAll({
    where: { id: req.params.id }
  })
    .then((cv_skill) => {
      console.log("CV_Skill found : ", JSON.stringify(cv_skill, null, 4));
      res.status(200).send(JSON.stringify(cv_skill, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Update a CV_Skill
router.put('/:id', (req, res) => {
  CV_Skill.update({
    firstname: req.body.firstname || req.body.firstName,
    lastname: req.body.lastname || req.body.lastName,
    modified_date: moment(new Date()),
  }, {
    where: { id: req.params.id }
  })
    .then((cv_skill) => {
      console.log("CV_Skill updated : ", JSON.stringify(cv_skill, null, 4));
      res.status(200).send(JSON.stringify(cv_skill, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

// Delete a CV_Skill
router.delete('/:id', (req, res) => {
  CV_Skill.destroy({
    where: { id: req.params.id }
  })
    .then(() => {
      console.log("CV_Skill destroy");
      res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(401);
    });
});

module.exports = router;