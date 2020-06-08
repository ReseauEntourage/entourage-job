const uuid = require('uuid/v4');
const {USER_ROLES} = require("../../../constants");


module.exports = (sequelize, DataTypes) => {
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
    },
    {}
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
      }
      return user;
    });
  };
  return User;
};
