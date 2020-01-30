const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Opportunity = sequelize.define(
    'Opportunity',
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

  Opportunity.beforeCreate((opportunity) => {
    const opportunityToCreate = opportunity;
    opportunityToCreate.id = uuid();
    return opportunityToCreate;
  });

  Opportunity.associate = function(models) {
    Opportunity.belongsToMany(models.BusinessLine, {
      through: 'Opportunity_BusinessLines',
      as: 'businessLines',
    });
    Opportunity.belongsToMany(models.User, {
      through: 'Opportunity_Users', // etrange
      as: 'users',
    });
    Opportunity.hasMany(models.Opportunity_User, {
      as: 'userOpportunity',
    });
  };
  return Opportunity;
};
