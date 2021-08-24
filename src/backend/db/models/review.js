import uuid from 'uuid/v4';

export default (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      CVId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CVs',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: DataTypes.STRING,
    },
    {}
  );
  Review.beforeCreate((review) => {
    const r = review;
    r.id = uuid();
    return r;
  });
  Review.associate = (models) => {
    Review.belongsTo(models.CV);
  };
  return Review;
};
