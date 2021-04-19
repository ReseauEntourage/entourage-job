const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define(
    'Language',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Language.beforeCreate((language) => {
    return (language.id = uuid());
  });
  Language.associate = (models) => {
    Language.belongsToMany(models.CV, {
      through: 'CV_Language',
      as: 'CVs',
      foreignKey: 'LanguageId',
      otherKey: 'CVId',
    });
  };
  return Language;
};
