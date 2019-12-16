/* eslint-disable no-restricted-globals */
const sequelize = require('sequelize');
const db = require('../db/config/databaseConnect');
const Opportunity = require('../db/models/opportunity')(
  db,
  sequelize.DataTypes
);
const BusinessLine = require('../db/models/businessline')(
  db,
  sequelize.DataTypes
);
const User = require('../db/models/user')(db, sequelize.DataTypes);

// const { Op } = sequelize;

const INCLUDE_OPPORTUNITY_COMPLETE = [
  {
    model: BusinessLine,
    through: { attributes: [] },
    attributes: ['name'],
  },
  {
    model: User,
    through: { attributes: [] },
    attributes: ['id', 'firstName'],
  },
];

Opportunity.belongsToMany(BusinessLine, {
  through: 'Opportunities_BusinessLines',
});
Opportunity.belongsToMany(User, { through: 'Opportunities_Users' });

const createOpportunity = (newOpportunity) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'createOpportunity -';
    console.log(`${infoLog} Création de l'opportunité`);

    let opportunityCreated;

    console.log(`${infoLog} Etape 1 - Création de l'opportunité de base`);
    Opportunity.create({
      category: newOpportunity.userId ? 'Perso' : 'Publique',
      title: newOpportunity.title,
      company: newOpportunity.company || null,
      recruiterName: newOpportunity.recruiterName,
      recruiterMail: newOpportunity.recruiterMail,
      recruiterPhone: newOpportunity.transport || null,
      location: newOpportunity.location || null,
      description: newOpportunity.description,
    })
      .then((opportunity) => {
        opportunityCreated = opportunity;
        console.log(`${infoLog} Etape 2 - BusinessLine`);
        if (newOpportunity.businessLines) {
          console.log(`${infoLog} BusinessLine présent à contrôler ou créer`);
          const businessLinePromise = newOpportunity.businessLines.map(
            (businessLine) => {
              return BusinessLine.findOrCreate({
                where: { name: businessLine },
              });
            }
          );
          return Promise.all(businessLinePromise);
        }
        return Promise.resolve([]);
      })
      .then((businessLines) => {
        console.log(`${infoLog} Etape 3 - Relation Opportunity / BusinessLine`);
        if (businessLines) {
          console.log(`${infoLog} businessLines trouvés ou créés`);
          const listBusinessLines = businessLines.map((businessLine) => {
            return businessLine[0];
          });
          console.log(`${infoLog} Ajout de la relation avec l'opportunité'`);
          return opportunityCreated.addBusinessLines(listBusinessLines);
        }
        return Promise.resolve();
      })
      .then(() => {
        console.log(
          `${infoLog} Etape 4 - Déterminer les Users à qui l'opportunité s'adresse`
        );
        if (newOpportunity.userId) {
          console.log(`${infoLog} Opportunité destiné à 1 seul candidat`);
          return Promise.resolve([{ id: newOpportunity.userId }]);
        }
        console.log(`${infoLog} Opportunité pour tous les candidats`);
        return User.findAll({ where: { role: 'Candidat' } });
      })
      .then((users) => {
        console.log(`${infoLog} Etape 5 - Relation Opportunity / Users`);
        if (users) {
          console.log(`${infoLog} Candidat(s) trouvé(s)`);
          const listUsers = users; /* .map((user) => {
            return user[0];
          }); */
          console.log(
            `${infoLog} Ajout de la relation entre l'opportunité et les users`
          );
          return opportunityCreated.addUsers(listUsers);
        }
        return Promise.resolve();
      })
      .then(() => {
        console.log(
          `${infoLog} Etape finale - Reprendre l'opportunité complète à retourner`
        );
        return Opportunity.findByPk(opportunityCreated.dataValues.id, {
          include: INCLUDE_OPPORTUNITY_COMPLETE,
        });
      })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const deleteOpportunity = (id) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'deleteOpportunity -';
    console.log(`${infoLog} Suppression d'une opportunité à partir de son id`);
    Opportunity.destroy({
      where: { id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getOpportunities = () => {
  return new Promise((resolve, reject) => {
    const infoLog = 'getOpportunities -';
    console.log(`${infoLog} Récupérer les opportunités`);
    Opportunity.findAll({
      /* where: {
        status: 'Published',
        visibility: true,
      }, */
      include: INCLUDE_OPPORTUNITY_COMPLETE,
    })
      .then((listOpportunities) => resolve(listOpportunities))
      .catch((err) => reject(err));
  });
};

const getOpportunity = (id) => {
  return new Promise((resolve, reject) => {
    Opportunity.findOne({
      where: { id },
      include: INCLUDE_OPPORTUNITY_COMPLETE,
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

/* const setCV = (id, cv) => {
  return new Promise((resolve, reject) => {
    const infoLog = 'setCV -';
    console.log(`${infoLog} Modification du CV`);
    CV.update(cv, {
      where: { id },
    })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}; */

module.exports = {
  createOpportunity,
  deleteOpportunity,
  getOpportunity,
  getOpportunities,
  /* setCV, */
};
