/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const {sendMail} = require('../../controllers/Mail');

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
    const sendMailEmbauche = async (
      toEmail,
      firstName,
      title,
      opportunityId,
      roleMin
    ) => {
      await sendMail({
        toEmail,
        subject: `${firstName} a retrouvé un emploi`,
        text: `
          ${firstName} vient de mentionner le statut "embauche" à propos de l'opportunité : ${title}.
          Vous pouvez maintenant l'archiver en cliquant ici :
          ${process.env.SERVER_URL}/backoffice/${roleMin}/offres?q=${opportunityId}.`,
      });
    };

    Opportunity_User.belongsTo(models.User);

    Opportunity_User.beforeUpdate(async (instance, option) => {
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
          const [{firstName, candidat}, {title}] = await Promise.all([
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
              ]
            }),
            models.Opportunity.findByPk(nextData.OpportunityId, {
              attributes: ['title'],
            }),
          ]);

          // mail admin
          await sendMailEmbauche(
            process.env.MAILJET_TO_EMAIL,
            firstName,
            title,
            nextData.OpportunityId,
            'admin'
          );
          if (candidat && candidat.coach) {
            // mail coach
            const email = candidat.coach.email;
            await sendMailEmbauche(
              email,
              firstName,
              title,
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
  return Opportunity_User;
};
