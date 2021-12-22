import { v4 as uuid } from 'uuid';

export default (sequelize, DataTypes) => {
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
      recruiterFirstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recruiterMail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recruiterPosition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recruiterPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      companyDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      skills: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      prerequisites: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contract: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      startOfContract: {
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
      endOfContract: {
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
      isPartTime: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      numberOfPositions: {
        allowNull: false,
        defaultValue: 1,
        type: DataTypes.INTEGER,
      },
      beContacted: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      message: {
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
