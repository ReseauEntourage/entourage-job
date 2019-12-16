const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Opportunity = sequelize.define(
    'Opportunities',
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {}
  );
  Opportunity.beforeCreate((opportunity) => {
    const opportunityToCreate = opportunity;
    opportunityToCreate.id = uuid();
    return opportunityToCreate;
  });
  Opportunity.associate = function(models) {
    Opportunity.belongsToMany(models.User, {
      through: 'Opportunities_User',
      as: 'Users',
      foreignKey: 'OpportunityId',
      otherKey: 'UserId',
    });
    Opportunity.belongsToMany(models.BusinessLine, {
      through: 'Opportunities_BusinessLine',
      as: 'BusinessLines',
      foreignKey: 'OpportunityId',
      otherKey: 'BusinessLineId',
    });
  };
  return Opportunity;
};
