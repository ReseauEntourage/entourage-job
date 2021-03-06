const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Ambition = sequelize.define(
    'Ambition',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Ambition.beforeCreate((ambition) => {
    return (ambition.id = uuid());
  });
  Ambition.associate = (models) => {
    // associations can be defined here
    Ambition.belongsToMany(models.CV, {
      through: 'CV_Ambition',
      as: 'CVs',
      foreignKey: 'AmbitionId',
      otherKey: 'CVId',
    });
  };
  return Ambition;
};
