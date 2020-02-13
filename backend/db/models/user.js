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
      userToCoach: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
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
      hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      url: DataTypes.STRING,
      lastConnection: DataTypes.DATE,
    },
    {}
  );

  User.beforeCreate((u) => {
    const user = u;
    user.id = uuid();
    user.url = `${u.firstName.toLowerCase().firstName}-${user.id.substring(
      0,
      8
    )}`;
    return user;
  });

  User.associate = (models) => {
    User.belongsToMany(models.Opportunity, {
      through: 'Opportunity_Users',
      as: 'opportunities',
    });
    User.hasMany(models.CV, {
      as: 'cvs',
    });
    User.belongsTo(models.User, {
      as: 'linkedUser',
      foreignKey: 'userToCoach',
      sourceKey: 'id',
    });
  };

  return User;
};
