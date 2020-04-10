/* eslint-disable camelcase */
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const CV_Skill = sequelize.define(
    'CV_Skill',
    {
      CVId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CVs',
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
  CV_Skill.beforeCreate((fields, _) => {
    const data = fields;
    data.id = uuid();
    return data;
  });
  CV_Skill.associate = function(models) {
    // associations can be defined here
  };
  return CV_Skill;
};
