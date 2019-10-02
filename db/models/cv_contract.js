/* eslint-disable camelcase */

module.exports = (sequelize, DataTypes) => {
  const CV_Contract = sequelize.define(
    'CV_Contract',
    {
      CVId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CVs',
          key: 'id',
        },
      },
      ContractId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Contracts',
          key: 'id',
        },
      },
    },
    {}
  );
  CV_Contract.associate = function(models) {
    // associations can be defined here
  };
  return CV_Contract;
};
