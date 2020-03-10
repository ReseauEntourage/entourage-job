const uuid = require('uuid/v4');

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
        defaultValue: 'Candidat',
      },
      password: {
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
      url: DataTypes.STRING, // go to usecandidat
      lastConnection: DataTypes.DATE,
    },
    {}
  );

  User.associate = (models) => {
    User.belongsToMany(models.Opportunity, {
      through: 'Opportunity_Users',
      as: 'opportunities',
    });
    User.hasOne(models.User_Candidat, {
      as: 'candidat',
    });

    User.beforeCreate((u) => {
      const user = u;
      user.id = uuid();
      user.email = user.email.toLowerCase();
      user.url = `${u.firstName.toLowerCase()}-${user.id.substring(0, 8)}`;
      return user;
    });
  };
  return User;
};
