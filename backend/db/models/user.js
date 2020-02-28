/* eslint-disable no-underscore-dangle */
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

    // lie un coach un utilisateur à son nouveau coach et délie un coach à son ancien user
    const linkUsers = (user) => {
      try {
        User.update(
          { userToCoach: null },
          {
            where: { userToCoach: user.id },
          }
        );
        if (user.userToCoach) {
          User.update(
            { userToCoach: user.id },
            {
              where: { id: user.userToCoach },
            }
          );
        }
      } catch (error) {
        console.error('linkUsers', error);
      }
    };

    User.beforeCreate((u) => {
      const user = u;
      user.id = uuid();
      user.email = user.email.toLowerCase();
      user.url = `${u.firstName.toLowerCase().firstName}-${user.id.substring(
        0,
        8
      )}`;
      linkUsers(user);
      return user;
    });
    User.beforeUpdate(async (instance, option) => {
      const nextData = instance.dataValues;
      const previousData = instance._previousDataValues;
      if (
        nextData &&
        previousData &&
        nextData.userToCoach !== previousData.userToCoach
      ) {
        linkUsers(nextData);
      }
    });
  };
  return User;
};
