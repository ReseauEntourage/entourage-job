import RedisManager from 'src/utils/RedisManager';

import { REDIS_KEYS, VALUES } from 'src/constants';

import Sequelize from 'sequelize';

import { models } from 'src/db/models';

const { Share } = models;

const updateShareCount = async (candidatId, type) => {
  try {
    const candidatShares = await Share.findOne({
      where: { CandidatId: candidatId },
    });
    if (candidatShares) {
      const updatedCandidatShares = {
        ...candidatShares,
        [type]: candidatShares[type] + 1,
      };
      await candidatShares.update(updatedCandidatShares, {
        where: { CandidatId: candidatId },
      });
    } else {
      await Share.create({
        CandidatId: candidatId,
        [type]: 1,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const getTotalShares = async () => {
  let totalShares = VALUES.SHARES;
  try {
    const redisKey = REDIS_KEYS.CVS_TOTAL_SHARES;
    const redisShares = await RedisManager.getAsync(redisKey);
    if (redisShares) {
      totalShares = parseInt(redisShares, 10);
    } else {
      const shares = await Share.findAll({
        attributes: [
          /*
            [Sequelize.fn('sum', Sequelize.col('facebook')), 'facebook'],
            [Sequelize.fn('sum', Sequelize.col('linkedin')), 'linkedin'],
            [Sequelize.fn('sum', Sequelize.col('twitter')), 'twitter'],
            [Sequelize.fn('sum', Sequelize.col('whatsapp')), 'whatsapp'],
          */
          [Sequelize.fn('sum', Sequelize.col('other')), 'other'],
        ],
      });
      const shareCounts = Object.values(shares[0].dataValues);
      if (
        shareCounts.every((shareCount) => {
          return !!shareCount;
        })
      ) {
        totalShares += Object.keys(shares[0].dataValues).reduce(
          (previous, key) => {
            return previous + parseInt(shares[0].dataValues[key], 10);
          },
          0
        );
      }

      await RedisManager.setWithExpireAsync(redisKey, totalShares, 60);
    }
  } catch (e) {
    console.log(e);
  }

  return totalShares;
};

export { updateShareCount, getTotalShares };
