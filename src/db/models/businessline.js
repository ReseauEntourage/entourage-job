import uuid from 'uuid/v4';

export default (sequelize, DataTypes) => {
  const BusinessLine = sequelize.define(
    'BusinessLine',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: -1,
      },
    },
    {}
  );
  BusinessLine.beforeCreate((businessLine) => {
    const bl = businessLine;
    bl.id = uuid();
    return bl;
  });
  BusinessLine.associate = (models) => {
    BusinessLine.belongsToMany(models.Opportunity, {
      through: 'Opportunity_BusinessLine',
      as: 'Opportunities',
      foreignKey: 'BusinessLineId',
      otherKey: 'OpportunityId',
    });
  };
  return BusinessLine;
};
