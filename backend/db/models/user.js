/* eslint-disable no-underscore-dangle */

const uuid = require('uuid/v4');
const {
  USER_ROLES
} = require("../../../constants");

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define(
    'User', {
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
      lastConnection: DataTypes.DATE,
      hashReset: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      saltReset: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {}
  );

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
      onDelete: 'cascade',
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
      return user;
    });

    User.afterCreate(async (user) => {
      if (user.role === USER_ROLES.CANDIDAT) {
        await models.User_Candidat.create({
          candidatId: user.id,
          url: `${user.firstName.toLowerCase()}-${user.id.substring(0, 8)}`,
        });
        await models.Share.create({
          CandidatId: user.id
        });
      }
      return user;
    });

    User.beforeUpdate(async (instance, option) => {
      const nextData = instance.dataValues;
      const previousData = instance._previousDataValues;
      if (
        nextData &&
        previousData &&
        nextData.role &&
        nextData.role !== previousData.role
      ) {
          if(previousData.role === USER_ROLES.CANDIDAT && nextData.role !== USER_ROLES.CANDIDAT) {
            try {
              await models.User_Candidat.destroy({
                where: {
                  candidatId: nextData.id
                },
              });
            }
            catch (e) {
              console.log('Candidat inexistant');
            }

          }
          else if(previousData.role !== USER_ROLES.CANDIDAT && nextData.role === USER_ROLES.CANDIDAT) {
            if(previousData.role === USER_ROLES.COACH) {
              try {
                await models.User_Candidat.update(
                  {
                    coachId: null
                  },
                  {
                    where: {
                      candidatId: previousData.coach.candidat.id
                    },
                  });
              }
              catch(e) {
                console.log('Pas de candidat associé');
              }
            }

            try {
              await models.User_Candidat.create({
                candidatId: nextData.id,
                url: `${nextData.firstName.toLowerCase()}-${nextData.id.substring(0, 8)}`,
              });

              await models.Share.findOrCreate({
                where: {
                  CandidatId: nextData.id
                }
              });
            }
            catch (e) {
              console.log(e);
            }
          }

        }
      })
  };
  return User;
};
