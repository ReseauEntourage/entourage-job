/* eslint-disable camelcase */

module.exports = (sequelize, DataTypes) => {
  const CV_Language = sequelize.define(
    'CV_Language',
    {
      CVId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CVs',
          key: 'id',
        },
      },
      LanguageId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Languages',
          key: 'id',
        },
      },
    },
    {}
  );
  CV_Language.associate = function (models) {
    // associations can be defined here
  };
  return CV_Language;
};
