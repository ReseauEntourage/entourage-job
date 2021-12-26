/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

import { JOBS, MAILJET_TEMPLATES, OFFER_STATUS } from 'src/constants';
import { addToWorkQueue } from 'src/jobs';
import _ from 'lodash';
import { findOfferStatus, getZoneSuffix } from 'src/utils/Finding';

// Duplicated because of bug during tests where the models are not found

const ATTRIBUTES_USER_CANDIDAT = [
  'employed',
  'hidden',
  'note',
  'url',
  'contract',
  'endOfContract',
];

const ATTRIBUTES_USER = [
  'id',
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'role',
  'adminRole',
  'zone',
  'gender',
  'lastConnection',
  'deletedAt',
];

const sendMailStatusUpdate = async (candidat, offer, status) => {
  const adminMail =
    process.env[`ADMIN_CANDIDATES_${getZoneSuffix(candidat.zone)}`];
  await addToWorkQueue({
    type: JOBS.JOB_TYPES.SEND_MAIL,
    toEmail: adminMail,
    templateId: MAILJET_TEMPLATES.STATUS_CHANGED,
    variables: {
      candidat: _.omitBy(candidat.toJSON(), _.isNil),
      offer: _.omitBy(offer.toJSON(), _.isNil),
      status: findOfferStatus(status).label,
    },
  });
};

export default (sequelize, DataTypes) => {
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
        nextData.status !== OFFER_STATUS[0].value
      ) {
        try {
          const [candidat, offer] = await Promise.all([
            models.User.findByPk(nextData.UserId, {
              attributes: ATTRIBUTES_USER,
              include: [
                {
                  model: models.User_Candidat,
                  as: 'candidat',
                  attributes: ATTRIBUTES_USER_CANDIDAT,
                  include: [
                    {
                      model: models.User,
                      as: 'coach',
                      attributes: ATTRIBUTES_USER,
                      paranoid: false,
                    },
                  ],
                },
                {
                  model: models.User_Candidat,
                  as: 'coach',
                  attributes: ATTRIBUTES_USER_CANDIDAT,
                  include: [
                    {
                      model: models.User,
                      as: 'candidat',
                      attributes: ATTRIBUTES_USER,
                      paranoid: false,
                    },
                  ],
                },
              ],
            }),
            models.Opportunity.findByPk(nextData.OpportunityId),
          ]);

          // mail admin
          await sendMailStatusUpdate(candidat, offer, nextData.status);
        } catch (err) {
          console.error(
            `Probleme lors de l'envoie du mail de mise à jour de status.`,
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
