import uuid from 'uuid/v4';

export default (sequelize, DataTypes) => {
  const Ambition = sequelize.define(
    'Ambition',
    {
      name: DataTypes.STRING,
      prefix: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'dans',
      },
      order: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: -1,
      },
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
