/* eslint-disable camelcase */

module.exports = (sequelize, DataTypes) => {
  const CV_Locations = sequelize.define('CV_Locations', {
    CVId: {
      type: DataTypes.UUID,
        allowNull: false,
        references: {
        model: 'CVs',
          key: 'id',
      },
    },
    LocationId: {
      type: DataTypes.UUID,
        allowNull: false,
        references: {
        model: 'Locations',
          key: 'id',
      },
    },
  }, {});

  CV_Locations.associate = function(models) {
    // associations can be defined here
  };

  return CV_Locations;
};
