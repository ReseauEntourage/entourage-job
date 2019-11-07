'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CVs', [{
      id: uuid(),
      firstname: "Zulfuye",
      lastname: "NomDeFamille",
      intro: "Motivée et curieuse, j'aimerais beaucoup travailler dans la gestion ou dans l'administration mais reste ouverte à toutes autres propositions",
      contract: "CDI / CDD",
      location: "Paris et proche",
      story: "Je m'appelle Zulfuye, j'ai 30 ans et je suis originaire de Turquie. J'ai grandi en France où j'ai étudié les sciences humaines et la compatibilité. Après plusieurs galères liées à un divorce difficile, je me suis retrouvée à la rue et je vis actuellement chez mes parents. Très motivée et déterminée, je souhaiterais trouver un emploi pour pouvoir avoir mon propre logement et être indépendante.",
      status: "Published",
      transport: "Pas de permis",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CVs', null, {});
  }
};
