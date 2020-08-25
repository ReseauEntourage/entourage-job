const sequelize = require('sequelize');

const {VALUES} = require("../../constants");

const {
  models: { Share },
  Sequelize: { Op, fn, col, where },
} = require('../db/models');

const updateShareCount = async (candidatId, type) => {
  try {
    const candidatShares = await Share.findOne({
      where: { CandidatId: candidatId },
    });
    if(candidatShares) {
      await candidatShares.increment(type, { by: 1 /* + Math.random() * Math.floor(6) */})
    }
    else {
      await Share.create(
        {
          CandidatId: candidatId,
          [type]: 1
        }
      );
    }
  }
  catch (e) {
    console.log(e);
  }
};


const getTotalShares = async () => {
  let totalShares = VALUES.SHARES;
  try {
    const shares = await Share.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.col('facebook')), 'facebook'],
        [sequelize.fn('sum', sequelize.col('linkedin')), 'linkedin'],
        [sequelize.fn('sum', sequelize.col('twitter')), 'twitter'],
        [sequelize.fn('sum', sequelize.col('whatsapp')), 'whatsapp'],
      ],
    });
    const shareCounts = Object.values(shares[0].dataValues);
    if(shareCounts.every((shareCount) => !!shareCount)) {
      totalShares += Object.keys(shares[0].dataValues).reduce((previous, key) => {
        return previous + parseInt(shares[0].dataValues[key], 10);
      }, 0);
    }
  }
  catch (e) {
    console.log(e);
  }

  return totalShares;
};

module.exports = {
  updateShareCount,
  getTotalShares
};
