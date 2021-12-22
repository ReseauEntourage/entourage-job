import { CV_STATUS } from 'src/constants';
import { paranoidDeleteCascade } from 'src/backend/utils/Sequelize';

import { v4 as uuid } from 'uuid';

export default (sequelize, DataTypes) => {
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
        type: DataTypes.TEXT,
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
      careerPathOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: CV_STATUS.New.value,
      },
      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      lastModifiedBy: {
        allowNull: true,
        type: DataTypes.UUID,
      },
    },
    {
      paranoid: true,
    }
  );
  CV.beforeCreate((fields) => {
    const data = fields;
    data.id = uuid();
    return data;
  });

  CV.associate = (models) => {
    // link and rename for association
    CV.belongsToMany(models.Ambition, {
      through: 'CV_Ambitions',
      as: 'ambitions',
      onDelete: 'CASCADE',
    });
    CV.belongsToMany(models.Contract, {
      through: 'CV_Contracts',
      as: 'contracts',
      onDelete: 'CASCADE',
    });
    CV.belongsToMany(models.Language, {
      through: 'CV_Language',
      as: 'languages',
      onDelete: 'CASCADE',
    });
    CV.belongsToMany(models.Passion, {
      through: 'CV_Passions',
      as: 'passions',
      onDelete: 'CASCADE',
    });
    CV.belongsToMany(models.BusinessLine, {
      through: 'CV_BusinessLines',
      as: 'businessLines',
      onDelete: 'CASCADE',
    });
    CV.belongsToMany(models.Skill, {
      through: 'CV_Skills',
      as: 'skills',
      onDelete: 'CASCADE',
    });

    CV.belongsToMany(models.Location, {
      through: 'CV_Locations',
      as: 'locations',
      onDelete: 'CASCADE',
    });

    CV.hasMany(models.Experience, {
      as: 'experiences',
      onDelete: 'CASCADE',
    });
    CV.hasMany(models.Review, {
      as: 'reviews',
      onDelete: 'CASCADE',
    });

    CV.belongsTo(models.User_Candidat, {
      as: 'user',
      foreignKey: 'UserId',
      targetKey: 'candidatId',
    });

    CV.hasOne(models.CV_Search, {
      as: 'cvSearch',
      foreignKey: 'CVId',
      sourceKey: 'id',
      onDelete: 'CASCADE',
    });

    CV.afterDestroy(paranoidDeleteCascade(models));
  };
  return CV;
};
