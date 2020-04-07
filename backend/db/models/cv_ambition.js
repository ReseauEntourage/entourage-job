/* eslint-disable camelcase */

module.exports = (sequelize, DataTypes) => {
  const CV_Ambition = sequelize.define(
    'CV_Ambition',
    {
      CVId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CVs',
          key: 'id',
        },
      },
      AmbitionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Ambitions',
          key: 'id',
        },
      },
    },
    {}
  );
  // CV_Ambition.associate = function(models) {
  //   // associations can be defined here
  // };
  return CV_Ambition;
};
