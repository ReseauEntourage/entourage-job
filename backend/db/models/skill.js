const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    'Skill',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Skill.beforeCreate((skill, _) => {
    const s = skill;
    s.id = uuid();
    return s;
  });
  Skill.associate = function(models) {};
  return Skill;
};
