const redis = require('redis');
const { promisify } = require('util');

const dev = process.env.NODE_ENV !== 'production';

const promisifyOrResolve = (instance, func, args=[]) => {
  if (instance) {
    return new Promise((resolve, reject) => {
      instance[func](...args, (error, result) => {
        if (error === null) {
          resolve(result);
        }
        else {
          resolve();
        }
      });
    });
  }
  return Promise.resolve();
};

const RedisManager = {
  getInstance() {
    if (dev) {
      return null;
    }

    if (!this.redisClient) {
      this.redisClient = redis.createClient(
        process.env.REDIS_URL,
        {
          connect_timeout: 50, // milliseconds
          retry_strategy: (retry_params) => {
            // return a number of ms to retry, or a non-number to stop
            return null; // never retry commands on error
          }
        }
      );

      this.redisClient.on('error', (error) => {
        console.error(error);
      });

      this.redisClient.on('end', () => {
        delete this.redisClient;
      });
    }
    return this.redisClient;
  },

  getAsync(key) {
    return promisifyOrResolve(this.getInstance(), 'get', [key]);
  },

  setAsync(key, value) {
    return promisifyOrResolve(this.getInstance(), 'set', [key, value]);
  },

  setWithExpireAsync(key, value, expire) {
    return promisifyOrResolve(this.getInstance(), 'setex', [key, expire, value]);
  },

  delAsync(key) {
    return promisifyOrResolve(this.getInstance(), 'del', [key]);
  },

  quitAsync() {
    return promisifyOrResolve(this.getInstance(), 'quit');
  },
};

module.exports = RedisManager;
