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
      dateStart: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateEnd: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
    },
    {}
  );
  Experience.beforeCreate((experience, _) => {
    const e = experience;
    e.id = uuid();
    return experience;
  });
  Experience.associate = function(models) {
    Experience.belongsTo(models.CV);
  };
  return Experience;
};
