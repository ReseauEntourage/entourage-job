const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const BusinessLine = sequelize.define(
    'BusinessLine',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  BusinessLine.beforeCreate((businessLine, _) => {
    const bl = businessLine;
    bl.id = uuid();
    return bl;
  });
  BusinessLine.associate = function (models) {
    BusinessLine.belongsToMany(models.Opportunity, {
      through: 'Opportunity_BusinessLine',
      as: 'Opportunities',
      foreignKey: 'BusinessLineId',
      otherKey: 'OpportunityId',
    });
  };
  return BusinessLine;
};
