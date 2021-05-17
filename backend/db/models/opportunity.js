const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Opportunity = sequelize.define(
    'Opportunity',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isValidated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      prerequisites: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {}
  );

  Opportunity.beforeCreate((opportunity) => {
    const opportunityToCreate = opportunity;
    opportunityToCreate.id = uuid();
    return opportunityToCreate;
  });

  Opportunity.associate = (models) => {
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
