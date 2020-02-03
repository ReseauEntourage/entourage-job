/* eslint-disable camelcase */

module.exports = (sequelize, DataTypes) => {
  const Opportunity_User = sequelize.define(
    'Opportunity_User',
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
      // seen: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: false,
      // },
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
  Opportunity_User.associate = function(models) {
    Opportunity_User.belongsTo(models.User);
    // , {
    //   through: 'Opportunity_User',
    //   as: 'Users',
    //   foreignKey: 'OpportunityId',
    //   otherKey: 'UserId',
    // });
    // associations can be defined here
  };
  return Opportunity_User;
};
