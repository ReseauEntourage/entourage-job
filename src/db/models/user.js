/* eslint-disable no-underscore-dangle */

import { USER_ROLES } from 'src/constants';

import uuid from 'uuid/v4';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils/Finding';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'Une adresse email doit être renseignée',
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0, 40],
            msg: '40 caractères maximum pour le prénom',
          },
          notEmpty: {
            args: true,
            msg: 'Un prénom est requis',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0, 40],
            msg: '40 caractères maximum pour le prénom',
          },
          notEmpty: {
            args: true,
            msg: 'Un prénom est requis',
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: USER_ROLES.CANDIDAT,
      },
      adminRole: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      password: {
        // hash
        type: DataTypes.TEXT,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 30],
            msg: '30 caractères maximum pour le numéro de téléphone',
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastConnection: DataTypes.DATE,
      hashReset: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      saltReset: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      paranoid: true,
    }
  );

  const generateUrl = (user) => {
    return `${user.firstName.toLowerCase()}-${user.id.substring(0, 8)}`;
  };

  User.associate = (models) => {
    User.belongsToMany(models.Opportunity, {
      through: 'Opportunity_Users',
      as: 'opportunities',
    });
    // si candidat regarder candidat
    User.hasOne(models.User_Candidat, {
      as: 'candidat',
      foreignKey: 'candidatId',
      sourceKey: 'id',
      hooks: true,
      onDelete: 'CASCADE',
    });
    // si coach regarder coach
    User.hasOne(models.User_Candidat, {
      as: 'coach',
      foreignKey: 'coachId',
      sourceKey: 'id',
    });

    User.beforeCreate((u) => {
      const user = u;
      user.id = uuid();
      user.email = user.email.toLowerCase();
      user.firstName = user.firstName.trim().replace(/\s\s+/g, ' ');
      user.lastName = user.lastName.trim().replace(/\s\s+/g, ' ');
      return user;
    });

    User.afterCreate(async (user) => {
      if (user.role === USER_ROLES.CANDIDAT) {
        await models.User_Candidat.create({
          candidatId: user.id,
          url: generateUrl(user),
        });
        await models.Share.create({
          CandidatId: user.id,
        });
      }
      return user;
    });

    User.beforeUpdate(async (instance) => {
      const nextData = instance.dataValues;
      const previousData = instance._previousDataValues;
      if (nextData && previousData) {
        if (nextData.role && nextData.role !== previousData.role) {
          if (
            previousData.role === USER_ROLES.CANDIDAT &&
            nextData.role !== USER_ROLES.CANDIDAT
          ) {
            try {
              await models.User_Candidat.destroy({
                where: {
                  candidatId: nextData.id,
                },
              });
            } catch (e) {
              console.log('Candidat inexistant');
            }
          } else if (
            previousData.role !== USER_ROLES.CANDIDAT &&
            nextData.role === USER_ROLES.CANDIDAT
          ) {
            if (previousData.role === USER_ROLES.COACH) {
              try {
                await models.User_Candidat.update(
                  {
                    coachId: null,
                  },
                  {
                    where: {
                      candidatId:
                        getCandidateIdFromCoachOrCandidate(previousData),
                    },
                  }
                );
              } catch (e) {
                console.log('Pas de candidat associé');
              }
            }

            try {
              await models.User_Candidat.create({
                candidatId: nextData.id,
                url: generateUrl(nextData),
              });

              await models.Share.findOrCreate({
                where: {
                  CandidatId: nextData.id,
                },
              });
            } catch (e) {
              console.log(e);
            }
          }
        }
        if (
          nextData.firstName !== previousData.firstName &&
          nextData.role === USER_ROLES.CANDIDAT
        ) {
          try {
            await models.User_Candidat.update(
              {
                url: generateUrl(nextData),
              },
              {
                where: {
                  candidatId: nextData.id,
                },
              }
            );
          } catch (e) {
            console.log(e);
          }
        }
      }
    });

    User.afterDestroy(async ({ dataValues: destroyedUser }) => {
      await models.User_Candidat.update(
        {
          coachId: null,
        },
        {
          where: {
            [destroyedUser.role === USER_ROLES.COACH
              ? 'coachId'
              : 'candidatId']: destroyedUser.id,
          },
        }
      );
    });
  };

  User.Revisions = User.hasPaperTrail();

  return User;
};
