const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const BusinessLine = sequelize.define(
    'BusinessLines',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  BusinessLine.beforeCreate((businessLine, _) => {
    const businessLineToCreate = businessLine;
    businessLineToCreate.id = uuid();
    return businessLineToCreate;
  });
  BusinessLine.associate = function(models) {
    BusinessLine.belongsToMany(models.Opportunities, {
      through: 'Opportunities_BusinessLine',
      as: 'Opportunities',
      foreignKey: 'BusinessLineId',
      otherKey: 'OpportunityId',
    });
  };
  return BusinessLine;
};
