'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CVs', [{
      id: uuid(),
      firstname: "Arthur",
      lastname: "Rimbaud",
      intro: "Arthur Rimbaud est un poète français, né le 20 octobre 1854 à Charleville et mort le 10 novembre 1891 à Marseille. Bien que brève, la densité de son œuvre poétique fait d'Arthur Rimbaud une des figures premières de la littérature française. Arthur Rimbaud écrit ses premiers poèmes à quinze ans",
      contract: "CDI",
      location: "Paris / Charleville-Mézière",
      story: "Arthur Rimbaud nait le 20 octobre 1854 à Charleville dans une famille bourgeoise, traditionnelle et conservatrice. Il est le deuxième de cinq enfants. Son père est militaire et sa mère est fille de propriétaires ruraux. Son père quitte la famille en 1861. Sa mère, figure rigide, très dévote et peu affectueuse élève seule, selon des principes éducatifs très stricts, Arthur et ses autres enfants. Le jeune Arthur est un élève modèle durant ses années d’école. Il obtient plusieurs prix d’excellence en littérature. En 1870, il fait une rencontre capitale dans sa vie future de poète. Cette année là, Georges Inzambrard est nommé professeur de rhétorique au Collège de Charleville. C’est grâce à l’influence libératrice de ce jeune professeur que Rimbaud découvre les parnassiens (Leconte de Lisle, Banville, Verlaine) et commence à écrire des vers en français. En août 1870, la France entre en guerre contre la Prusse et Arthur fait ses premières fugues à Paris. Il est attiré par l’esprit révolutionnaire qui empreigne la capitale. A Paris, ayant quitté ses études, il fréquente le café Dutherme où il connait l’homme qui le recommande à Paul Verlaine. Verlaine reçoit avec enthousiasme ses poèmes et il devient son ami. Rimbaud s’installe alors dans le cercle familial de Verlaine. A partir de 1871, la relation entre les deux poètes devient de plus en plus intime. Verlaine abandonne femme et enfants et ils commencent ensemble une vie d’errance et de bohème entre drogue et alcool. Pendant cette période, il écrit « Les Illuminations » et « Une saison enfer ». Leur relation tumultueuse a une issue tragique. Le 10 juillet 1873 Verlaine achète un pistolet et tire sur Rimbaud, le blessant au poignet. Verlaine est emprisonné et leur histoire se termine.",
      status: "Published",
      transport: "Calèche / Cheval",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CVs', null, {});
  }
};
