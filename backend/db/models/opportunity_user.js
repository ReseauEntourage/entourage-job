/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const { sendMail } = require('../../controllers/mail');

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
      defaultValue: 0,
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
  Opportunity_User.associate = function(models) {
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
        // mail admin
        sendMail({
          toEmail: 'johann.hospice@accenture.com',
          subject: 'Embauche',
          text: 'TO DEFINE avec un lien',
        });
        // mail coach
        const { data } = await models.User.findOne({
          where: {
            id: nextData.UserId,
          },
          attributes: ['userToCoach'],
        });
        if (data) {
          const { coachData } = await models.User.findOne({
            where: {
              id: data.userToCoach,
            },
            attributes: ['email'],
          });
          sendMail({
            toEmail: coachData.email,
            subject: 'Embauche',
            text: 'TO DEFINE avec un lien',
          });
        }
      }
    });
  };
  return Opportunity_User;
};
