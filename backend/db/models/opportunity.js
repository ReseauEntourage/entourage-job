const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Opportunities = sequelize.define(
    'Opportunities',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Public',
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recruiterName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recruiterMail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recruiterPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: DataTypes.DATE,
      location: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );
  Opportunities.beforeCreate((opportunity) => {
    const opportunityToCreate = opportunity;
    opportunityToCreate.id = uuid();
    return opportunityToCreate;
  });
  Opportunities.associate = function(models) {
    Opportunities.belongsToMany(models.BusinessLines, {
      through: 'Opportunities_BusinessLine',
      as: 'BusinessLines',
      foreignKey: 'OpportunityId',
      otherKey: 'BusinessLineId',
    });
    // models.Opportunity.belongsToMany(models.User, {
    //   through: 'Opportunities_Users',
    // });
  };
  return Opportunities;
};
