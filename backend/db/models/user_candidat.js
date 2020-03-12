/* eslint-disable no-underscore-dangle */
module.exports = (sequelize, DataTypes) => {
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
      hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      note: DataTypes.TEXT,
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
    UserCandidat.hasMany(models.CV, {
      as: 'cvs',
      sourceKey: 'candidatId',
      foreignKey: 'UserId',
    });

    UserCandidat.beforeCreate(async (u) => {
      const user = await models.User.findByPk(u.candidatId, {
        attributes: ['id', 'firstname'],
      });
      user.url = `${user.firstName.toLowerCase()}-${user.id.substring(0, 8)}`;
      return user;
    });

    // / TODO
    // lie un coach un utilisateur à son nouveau coach et délie un coach à son ancien user
    const linkUsers = (userCandidat) => {
      console.log('TODO UPDATE UserCandidat.beforeUpdate');
      UserCandidat.update(
        { coachId: null },
        {
          where: { coachId: userCandidat.coachId },
        }
      )
        .then(() => {
          if (userCandidat.coachId) {
            UserCandidat.update(
              { coachId: userCandidat.id },
              {
                where: { id: userCandidat.coachId },
              }
            );
          }
        })
        .catch((error) => {
          console.error('linkUsers', error);
        });
    };
    UserCandidat.beforeCreate((u) => {
      linkUsers(u);
      return u;
    });
    UserCandidat.beforeUpdate((instance, option) => {
      const nextData = instance.dataValues;
      const previousData = instance._previousDataValues;
      if (nextData && previousData && nextData.coachId !== previousData.v) {
        linkUsers(nextData);
      }
    });
  };
  return UserCandidat;
};
