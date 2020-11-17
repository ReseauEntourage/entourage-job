const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const CV_Search = sequelize.define(
    'CV_Search',
    {
      CVId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CV',
          key: 'id',
        },
      },
      searchString: DataTypes.TEXT,
    },
    {}
  );
  CV_Search.beforeCreate((fields, _) => {
    const data = fields;
    data.id = uuid();
    return data;
  });
  CV_Search.associate = (models) => {
    // link and rename for association

    CV_Search.belongsTo(models.CV, {
      as: 'cv',
      foreignKey: 'CVId',
      targetKey: 'id',
    });
  };
  return CV_Search;
};
