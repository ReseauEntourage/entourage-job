import { v4 as uuid } from 'uuid';

export default (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    'Skill',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Skill.beforeCreate((skill) => {
    const s = skill;
    s.id = uuid();
    return s;
  });
  Skill.associate = () => {};
  return Skill;
};
