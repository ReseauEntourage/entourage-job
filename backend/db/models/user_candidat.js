module.exports = (sequelize, DataTypes) => {
  const UserCandidat = sequelize.define(
    'User_Candidat',
    {
      candidatId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      coachId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      employed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      tracking: DataTypes.TEXT,
    },
    {}
  );

  UserCandidat.associate = (models) => {
    UserCandidat.belongsTo(models.User, {
      as: 'candidat',
      foreignKey: 'candidatId',
      sourceKey: 'id',
    });
    UserCandidat.belongsTo(models.User, {
      as: 'coach',
      foreignKey: 'coachId',
      sourceKey: 'id',
    });
  };
  return UserCandidat;
};
