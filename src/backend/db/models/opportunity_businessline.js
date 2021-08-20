/* eslint-disable camelcase */

export default (sequelize, DataTypes) => {
  const Opportunity_BusinessLine = sequelize.define(
    'Opportunity_BusinessLine',
    {
      OpportunityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Opportunities',
          key: 'id',
        },
      },
      BusinessLineId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'BusinessLines',
          key: 'id',
        },
      },
    },
    {}
  );
  Opportunity_BusinessLine.associate = () => {
    // associations can be defined here
  };
  return Opportunity_BusinessLine;
};
