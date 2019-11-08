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
      role: DataTypes.STRING,
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  User.beforeCreate((user) => {
    return (user.id = uuid());
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
