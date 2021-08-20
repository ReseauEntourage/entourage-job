/* eslint-disable camelcase */
import uuid from 'uuid/v4';

export default (sequelize, DataTypes) => {
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
  Experience_Skill.beforeCreate((fields) => {
    const data = fields;
    data.id = uuid();
    return data;
  });
  Experience_Skill.associate = () => {
    // associations can be defined here
  };
  return Experience_Skill;
};
