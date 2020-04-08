const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define(
    'Experience',
    {
      CVId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CVs',
          key: 'id',
        },
      },
      description: DataTypes.TEXT,
    },
    {}
  );
  Experience.beforeCreate((experience, _) => ({
    id: uuid(),
    ...experience,
  }));
  Experience.associate = (models) => {
    Experience.belongsTo(models.CV);
    Experience.belongsToMany(models.Skill, {
      through: 'Experience_Skills',
      as: 'skills',
    });
  };
  return Experience;
};
