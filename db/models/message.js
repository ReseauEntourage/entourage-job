'use strict';

const uuid = require("uuid/v4");

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 30],
          msg: "30 caractères maximum pour le prénom"
        },
        notEmpty: {
          args: true,
          msg: "Un prénom est requis"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 30],
          msg: "30 caractères maximum pour le nom"
        },
        notEmpty: {
          args: true,
          msg: "Un nom est requis"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: "Adresse e-mail invalide"
        },
        notEmpty: {
          args: true,
          msg: "Une adresse e-mail est requise"
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 30],
          msg: "30 caractères maximum pour le numéro de téléphone"
        },
        notEmpty: {
          args: true,
          msg: "Un numéro de téléphone est requis"
        }
      }
    },
    job: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 60],
          msg: "60 caractères maximum pour le métier"
        },
        notEmpty: {
          args: true,
          msg: "Le métier proposé est requis"
        }
      }
    },
    businessLine: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Le secteur d'activité est requis"
        }
      }
    },
    company: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 60],
          msg: "60 caractères maximum pour le nom d'entreprise"
        },
        notEmpty: {
          args: true,
          msg: "L'entreprise proposant le job est requis"
        }
      }
    },
    localization: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 100],
          msg: "100 caractères maximum pour la localisation"
        },
        notEmpty: {
          args: true,
          msg: "La localisation du job est requise"
        }
      }
    },
    message: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [1, 4000],
          msg: "4000 caractères maximum pour le message"
        },
        notEmpty: {
          args: true,
          msg: "Le message au candidat est requis"
        }
      }
    }
  }, {});
  Message.beforeCreate((message, _) => {
    return message.id = uuid();
  });
  Message.associate = function (models) {
    // associations can be defined here
  };
  return Message;
};