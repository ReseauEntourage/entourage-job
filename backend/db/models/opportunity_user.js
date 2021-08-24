/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const { JOBS } = require('../../../constants');
const { addToWorkQueue } = require('../../jobs');

const sendMailEmbauche = async (
  toEmail,
  firstName,
  title,
  company,
  opportunityId,
  roleMin
) => {
  await addToWorkQueue({
    type: JOBS.JOB_TYPES.SEND_MAIL,
    toEmail,
    subject: `${firstName} a retrouvé un emploi`,
    html:
      `Bonjour,<br /><br />` +
      `${firstName} vient de mentionner le statut "embauche" à propos de l'opportunité : <strong>${title} - ${company}</strong>.<br /><br />` +
      `Vous pouvez maintenant l'archiver en cliquant ici :<br />` +
      `<strong>${process.env.SERVER_URL}/backoffice/${roleMin}/offres?q=${opportunityId}</strong>.<br /><br />` +
      `L'équipe LinkedOut`,
  });
};

module.exports = (sequelize, DataTypes) => {
  const Opportunity_User = sequelize.define('Opportunity_User', {
    OpportunityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Opportunities',
        key: 'id',
      },
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    bookmarked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Opportunity_User.associate = (models) => {
    Opportunity_User.belongsTo(models.User);

    Opportunity_User.beforeUpdate(async (instance) => {
      const nextData = instance.dataValues;
      const previousData = instance._previousDataValues;
      // si Embauche, envoyer email a admin et coach
      if (
        nextData &&
        previousData &&
        nextData.status !== previousData.status &&
        nextData.status === 2
      ) {
        try {
          const [
            { firstName, candidat },
            { title, company },
          ] = await Promise.all([
            models.User.findByPk(nextData.UserId, {
              attributes: ['firstName'],
              include: [
                {
                  model: models.User_Candidat,
                  as: 'candidat',
                  include: [
                    {
                      model: models.User,
                      as: 'coach',
                      attributes: ['email'],
                    },
                  ],
                },
              ],
            }),
            models.Opportunity.findByPk(nextData.OpportunityId, {
              attributes: ['title', 'company'],
            }),
          ]);

          // mail admin
          await sendMailEmbauche(
            process.env.MAILJET_TO_EMAIL,
            firstName,
            title,
            company,
            nextData.OpportunityId,
            'admin'
          );
          if (candidat && candidat.coach) {
            // mail coach
            const { email } = candidat.coach;
            await sendMailEmbauche(
              email,
              firstName,
              title,
              company,
              nextData.OpportunityId,
              'candidat'
            );
          }
        } catch (err) {
          console.error(
            `Probleme lors de l'envoie du mail d'embauche validée.`,
            `UserId: ${nextData.UserId}`,
            `OpportunityId: ${nextData.OpportunityId}`,
            err
          );
        }
      }
    });
  };

  Opportunity_User.Revisions = Opportunity_User.hasPaperTrail();

  return Opportunity_User;
};
