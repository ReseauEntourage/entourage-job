/* eslint-disable camelcase */

module.exports = (sequelize, DataTypes) => {
  const Opportunities_Users = sequelize.define(
    'Opportunities_Users',
    {
      OpportunityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Opportunities',
          key: 'id',
        },
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      seen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bookmarked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {}
  );
  Opportunities_Users.associate = function(models) {
    Opportunities_Users.belongsTo(models.User);
    // , {
    //   through: 'Opportunities_Users',
    //   as: 'Users',
    //   foreignKey: 'OpportunityId',
    //   otherKey: 'UserId',
    // });
    // associations can be defined here
  };
  return Opportunities_Users;
};
