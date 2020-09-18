const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Contract = sequelize.define(
    'Contract',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Contract.beforeCreate((contract, _) => {
    return (contract.id = uuid());
  });
  Contract.associate = function (models) {
    Contract.belongsToMany(models.CV, {
      through: 'CV_Contract',
      as: 'CVs',
      foreignKey: 'ContractId',
      otherKey: 'CVId',
    });
  };
  return Contract;
};
