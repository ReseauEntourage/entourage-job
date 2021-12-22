import { v4 as uuid } from 'uuid';

export default (sequelize, DataTypes) => {
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
      order: {
        type: DataTypes.INTEGER,
        defaultValue: -1,
      },
    },
    {}
  );
  Experience.beforeCreate((fields) => {
    const data = fields;
    data.id = uuid();
    return data;
  });
  Experience.associate = (models) => {
    Experience.belongsTo(models.CV);
    Experience.belongsToMany(models.Skill, {
      through: 'Experience_Skills',
      as: 'skills',
    });
  };
  return Experience;
};
