import { v4 as uuid } from 'uuid';

export default (sequelize, DataTypes) => {
  const Passion = sequelize.define(
    'Passion',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Passion.beforeCreate((passion) => {
    return (passion.id = uuid());
  });
  Passion.associate = (models) => {
    Passion.belongsToMany(models.CV, {
      through: 'CV_Passion',
      // as: 'Passions',
      // foreignKey: 'PassionId',
      // otherKey: 'CVId',
      as: 'CVs',
      foreignKey: 'PassionId',
      otherKey: 'CVId',
    });
  };
  return Passion;
};
