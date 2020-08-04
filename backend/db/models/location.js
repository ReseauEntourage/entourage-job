const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: DataTypes.STRING
  }, {});

  Location.beforeCreate((businessLine, _) => {
    const bl = businessLine;
    bl.id = uuid();
    return bl;
  });

  Location.associate = function(models) {
    Location.belongsToMany(models.CV, {
      through: 'CV_Location',
      as: 'CVs',
      foreignKey: 'LocationId',
      otherKey: 'CVId',
    });
  };
  return Location;
};
