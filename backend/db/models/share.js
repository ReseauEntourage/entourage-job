const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Share = sequelize.define(
    'Share',
    {
      CandidatId: {
        allowNull: false,
        type: DataTypes.UUID,
        unique: true,
      },
      facebook: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      twitter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      linkedin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      whatsapp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {}
  );

  Share.associate = () => {
    Share.beforeCreate((s) => {
      const share = s;
      share.id = uuid();
      return share;
    });
  };

  Share.Revisions = Share.hasPaperTrail();

  return Share;
};
