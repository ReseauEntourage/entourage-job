/* eslint-disable camelcase */
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Experience_Skill = sequelize.define(
    'Experience_Skill',
    {
      ExperienceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Experiences',
          key: 'id',
        },
      },
      SkillId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Skills',
          key: 'id',
        },
      },
    },
    {}
  );
  Experience_Skill.beforeCreate((fields, _) => {
    const data = fields;
    data.id = uuid();
    return data;
  });
  Experience_Skill.associate = (models) => {
    // associations can be defined here
  };
  return Experience_Skill;
};
