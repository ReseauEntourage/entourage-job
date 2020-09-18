const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
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
  Review.beforeCreate((review, _) => {
    const r = review;
    r.id = uuid();
    return r;
  });
  Review.associate = function (models) {
    Review.belongsTo(models.CV);
  };
  return Review;
};
