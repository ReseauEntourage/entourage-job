const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const CV = sequelize.define(
    'CV',
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [1, 30],
            msg: '30 caractères maximum pour le prénom',
          },
          notEmpty: {
            args: true,
            msg: 'Un prénom est requis',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        /* validate: {
          len: {
            args: [1, 30],
            msg: '30 caractères maximum pour le nom',
          },
          notEmpty: {
            args: true,
            msg: 'Un nom est requis',
          },
        }, */
      },
      intro: {
        type: DataTypes.TEXT,
        /* validate: {
          len: {
            args: [1, 2000],
            msg: "2000 caractères maximum pour l'introduction",
          },
          notEmpty: {
            args: true,
            msg: "L'introduction est requise",
          },
        }, */
      },
      story: {
        type: DataTypes.TEXT,
        /* validate: {
          len: {
            args: [1, 8000],
            msg: '8000 caractères maximum pour la story',
          },
          notEmpty: {
            args: true,
            msg: 'La story est requise',
          },
        }, */
      },
      location: {
        type: DataTypes.STRING,
        /* validate: {
          len: {
            args: [1, 100],
            msg: '100 caractères maximum pour la localisation',
          },
          notEmpty: {
            args: true,
            msg: 'La localisation est requise',
          },
        }, */
      },
      availability: {
        type: DataTypes.STRING,
      },
      transport: {
        type: DataTypes.STRING,
        /* validate: {
          len: {
            args: [1, 100],
            msg: '100 caractères maximum pour le transport',
          },
          notEmpty: {
            args: true,
            msg: 'Transport est requis',
          },
        }, */
      },
      catchphrase: {
        type: DataTypes.STRING,
      },
      devise: {
        type: DataTypes.STRING,
      },
      careerPath: {
        type: DataTypes.STRING,
      },
      status: DataTypes.STRING,
      visibility: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {}
  );
  CV.beforeValidate((cv) => {
    const cvToCreate = cv;
    if (cvToCreate.firstName && cvToCreate.userId) {
      cvToCreate.url = `${cvToCreate.firstName.toLowerCase()}-${cvToCreate.userId.substring(
        0,
        8
      )}`;
    }
    return cvToCreate;
  });
  CV.beforeCreate((cv) => {
    const cvToCreate = cv;
    cvToCreate.id = uuid();
    return cvToCreate;
  });
  CV.associate = function(models) {
    CV.belongsToMany(models.Skill, {
      through: 'CV_Skill',
      as: 'Skills',
      foreignKey: 'CVId',
      otherKey: 'SkillId',
    });
    CV.belongsToMany(models.Language, {
      through: 'CV_Language',
      as: 'Languages',
      foreignKey: 'CVId',
      otherKey: 'LanguageId',
    });
    CV.belongsToMany(models.Contract, {
      through: 'CV_Contract',
      as: 'Contracts',
      foreignKey: 'CVId',
      otherKey: 'ContractId',
    });
    CV.belongsToMany(models.Passion, {
      through: 'CV_Passion',
      as: 'Passions',
      foreignKey: 'CVId',
      otherKey: 'PassionId',
    });
    CV.belongsToMany(models.Ambitions, {
      through: 'CV_Ambition',
      as: 'Ambitions',
      foreignKey: 'CVId',
      otherKey: 'AmbitionId',
    });
  };
  return CV;
};
