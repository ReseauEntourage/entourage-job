/* eslint-disable camelcase */

export default (sequelize, DataTypes) => {
  const CV_Passion = sequelize.define(
    'CV_Passion',
    {
      CVId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CVs',
          key: 'id',
        },
      },
      PassionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Passions',
          key: 'id',
        },
      },
    },
    {}
  );
  CV_Passion.associate = () => {
    // associations can be defined here
  };
  return CV_Passion;
};
