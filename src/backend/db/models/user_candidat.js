/* eslint-disable no-underscore-dangle */
export default (sequelize, DataTypes) => {
  const UserCandidat = sequelize.define(
    'User_Candidat',
    {
      candidatId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
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
      contract: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      endOfContract: {
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      note: DataTypes.TEXT,
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastModifiedBy: {
        allowNull: true,
        type: DataTypes.UUID,
      },
    },
    {}
  );

  UserCandidat.associate = (models) => {
    // lie un coach un utilisateur à son nouveau coach et délie un coach à son ancien user
    const clearCoachBindings = (coachId) => {
      return UserCandidat.update(
        { coachId: null },
        {
          where: { coachId },
        }
      );
    };

    UserCandidat.belongsTo(models.User, {
      as: 'candidat',
      foreignKey: 'candidatId',
      sourceKey: 'id',
      hooks: true,
      onDelete: 'cascade',
    });
    UserCandidat.belongsTo(models.User, {
      as: 'coach',
      foreignKey: 'coachId',
      sourceKey: 'id',
    });
    UserCandidat.hasMany(models.CV, {
      as: 'cvs',
      sourceKey: 'candidatId',
      foreignKey: 'UserId',
    });

    UserCandidat.beforeCreate(async (newUserCandidat) => {
      const user = await models.User.findByPk(newUserCandidat.candidatId, {
        attributes: ['id', 'firstName'],
      });
      const userCandidat = newUserCandidat;
      userCandidat.url = `${user.firstName.toLowerCase()}-${user.id.substring(
        0,
        8
      )}`;
      if (userCandidat.coachId) {
        await clearCoachBindings(userCandidat.coachId);
      }
      return userCandidat;
    });

    UserCandidat.beforeUpdate(async (instance) => {
      const nextData = instance.dataValues;
      const previousData = instance._previousDataValues;
      if (
        nextData &&
        previousData &&
        nextData.coachId &&
        nextData.coachId !== previousData.coachId
      ) {
        await clearCoachBindings(nextData.coachId);
      }
    });
  };
  return UserCandidat;
};
