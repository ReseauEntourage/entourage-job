import { v4 as uuid } from 'uuid';

export default (sequelize, DataTypes) => {
  const Location = sequelize.define(
    'Location',
    {
      name: DataTypes.STRING,
    },
    {}
  );

  Location.beforeCreate((businessLine) => {
    const bl = businessLine;
    bl.id = uuid();
    return bl;
  });

  Location.associate = (models) => {
    Location.belongsToMany(models.CV, {
      through: 'CV_Location',
      as: 'CVs',
      foreignKey: 'LocationId',
      otherKey: 'CVId',
    });
  };
  return Location;
};
