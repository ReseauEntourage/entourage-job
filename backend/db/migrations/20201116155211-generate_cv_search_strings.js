const {
  models,
  sequelize,
  // Sequelize: { Op, fn, col, where },
} = require('../../db/models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return sequelize.query(`
      with groupCVs as (select
            /* pour chaque user, dernier CV publiés */
            "UserId",
            MAX(version) as version
        from "User_Candidats",
             "CVs"
        where "CVs".status = 'Published'
          and "User_Candidats"."candidatId" = "CVs"."UserId"
        group by "UserId")


      INSERT INTO "CV_Searches" ("id", "CVId", "searchString", "createdAt", "updatedAt")
      select uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text) placing '4' from 13)
                             placing to_hex(floor(random() * (11 - 8 + 1) + 8)::int)::text from 17)::cstring),
             cvs.id,
             concat(string_agg(distinct ambitions.name, ' '), ' ', string_agg(distinct businessLines.name, ' '), ' ',
                    string_agg(distinct contracts.name, ' '), ' ', string_agg(distinct languages.name, ' '), ' ',
                    string_agg(distinct locations.name, ' '), ' ', string_agg(distinct passions.name, ' '), ' ',
                    string_agg(distinct skills.name, ' '), ' ', string_agg(distinct experiences.description, ' '),
                    ' ', string_agg(distinct experienceSkills.name, ' '), ' ',
                    string_agg(distinct reviews.name, ' '), ' ', string_agg(distinct reviews.status, ' '), ' ',
                    string_agg(distinct reviews.text, ' '), ' ', string_agg(distinct users."firstName", ' '), ' ',
                    string_agg(distinct users."lastName", ' '), ' ', string_agg(distinct cvs.catchphrase, ' '), ' ',
                    string_agg(distinct cvs.availability, ' '), ' ', string_agg(distinct cvs.story, ' '), ' ',
                    string_agg(distinct cvs.transport, ' ')) as searchstring,
             now(),
             now()

      from "CVs" cvs

         LEFT JOIN "CV_Ambitions"
                   ON cvs.id = "CV_Ambitions"."CVId"
         LEFT JOIN "Ambitions" ambitions
                   ON ambitions.id = "CV_Ambitions"."AmbitionId"

         LEFT JOIN "CV_BusinessLines"
                   ON cvs.id = "CV_BusinessLines"."CVId"
         LEFT JOIN "BusinessLines" businessLines
                   ON businessLines.id = "CV_BusinessLines"."BusinessLineId"

         LEFT JOIN "CV_Contracts"
                   ON cvs.id = "CV_Contracts"."CVId"
         LEFT JOIN "Contracts" contracts
                   ON contracts.id = "CV_Contracts"."ContractId"

         LEFT JOIN "CV_Languages"
                   ON cvs.id = "CV_Languages"."CVId"
         LEFT JOIN "Languages" languages
                   ON languages.id = "CV_Languages"."LanguageId"

         LEFT JOIN "CV_Locations"
                   ON cvs.id = "CV_Locations"."CVId"
         LEFT JOIN "Locations" locations
                   ON locations.id = "CV_Locations"."LocationId"

         LEFT JOIN "CV_Passions"
                   ON cvs.id = "CV_Passions"."CVId"
         LEFT JOIN "Passions" passions
                   ON passions.id = "CV_Passions"."PassionId"

         LEFT JOIN "CV_Skills"
                   ON cvs.id = "CV_Skills"."CVId"
         LEFT JOIN "Skills" skills
                   ON skills.id = "CV_Skills"."SkillId"

         LEFT JOIN "Experiences" experiences
                   ON cvs.id = experiences."CVId"
         LEFT JOIN "Experience_Skills"
                   ON experiences.id = "Experience_Skills"."ExperienceId"
         LEFT JOIN "Skills" experienceSkills
                   ON experienceSkills.id = "Experience_Skills"."SkillId"

         LEFT JOIN "Reviews" reviews
                   ON cvs.id = reviews."CVId"

         LEFT JOIN "Users" users
                   ON cvs."UserId" = users.id

         INNER JOIN groupCVs
                   ON cvs."UserId" = groupCVs."UserId" and cvs.version = groupCVs.version

      group by cvs.id;
    `);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  },
};
