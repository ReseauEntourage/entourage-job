const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Passion = sequelize.define(
    'Passion',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Passion.beforeCreate((passion, _) => {
    return (passion.id = uuid());
  });
  Passion.associate = function(models) {
    // associations can be defined here
    Passion.belongsToMany(models.CV, {
      through: 'CV_Passion',
      as: 'Passions',
      foreignKey: 'PassionId',
      otherKey: 'CVId',
    });
  };
  return Passion;
};
