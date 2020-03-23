/* eslint-disable camelcase */

module.exports = (sequelize, DataTypes) => {
  const CV_BusinessLines = sequelize.define(
    'CV_BusinessLines',
    {
      CVId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CVs',
          key: 'id',
        },
      },
      BusinessLineId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'BusinessLines',
          key: 'id',
        },
      },
    },
    {}
  );
  // CV_BusinessLines.associate = function(models) {
  //   // associations can be defined here
  // };
  return CV_BusinessLines;
};
