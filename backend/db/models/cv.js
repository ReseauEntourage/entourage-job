const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const CV = sequelize.define(
    'CV',
    {
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User_Candidat',
          key: 'candidatId',
        },
      },
      urlImg: DataTypes.STRING,
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
      catchphrase: DataTypes.STRING,
      devise: DataTypes.STRING,
      careerPathOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'New',
      },
      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {}
  );
  CV.beforeCreate((cv) => {
    const cvToCreate = cv;
    cvToCreate.id = uuid();
    return cvToCreate;
  });
  CV.associate = function(models) {
    // link and rename for association
    CV.belongsToMany(models.Ambition, {
      through: 'CV_Ambitions',
      as: 'ambitions',
    });
    CV.belongsToMany(models.Contract, {
      through: 'CV_Contracts',
      as: 'contracts',
    });
    CV.belongsToMany(models.Language, {
      through: 'CV_Language',
      as: 'languages',
    });
    CV.belongsToMany(models.Skill, {
      through: 'CV_Skills',
      as: 'skills',
    });
    CV.belongsToMany(models.Passion, {
      through: 'CV_Passions',
      as: 'passions',
    });

    CV.hasMany(models.Experience, {
      as: 'experiences',
    });
    CV.hasMany(models.Review, {
      as: 'reviews',
    });
    CV.belongsTo(models.User_Candidat, {
      as: 'user',
      foreignKey: 'UserId',
      targetKey: 'candidatId',
    });
  };
  return CV;
};
