import uuid from 'uuid/v4';

export default (sequelize, DataTypes) => {
  const Contract = sequelize.define(
    'Contract',
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Contract.beforeCreate((contract) => {
    return (contract.id = uuid());
  });
  Contract.associate = (models) => {
    Contract.belongsToMany(models.CV, {
      through: 'CV_Contract',
      as: 'CVs',
      foreignKey: 'ContractId',
      otherKey: 'CVId',
    });
  };
  return Contract;
};
