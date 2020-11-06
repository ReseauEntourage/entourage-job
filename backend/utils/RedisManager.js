const redis = require('redis');

const dev = process.env.NODE_ENV !== 'production';

const promisify = (instance, func, args) => {
  return new Promise((res, rej) => {
    const handleResponse = (error, result) => {
      if (!error) {
        res(result);
      } else {
        console.error(error);
        res();
      }
    };

    try {
      if (args) {
        instance[func](...args, handleResponse);
      } else {
        instance[func](handleResponse);
      }
    }
    catch (e) {
      console.error(e);
      res();
    }
  });
  /* setTimeout(() => {
      console.log('REDIS TIMEOUT');
      res();
    }, 1000); */
};

const promisifyOrResolve = (instance, func, args) => {
  if (dev && !instance.error) {
    return promisify(instance, func, args);
  }
  return Promise.resolve();
};

const RedisManager = {
  getInstance() {
    console.log('DYNO VERSION = ', process.env.HEROKU_RELEASE_VERSION);
    if (!this.redisClient) {
      this.redisClient = redis.createClient(process.env.REDIS_URL);

      this.redisClient.on('error', (error) => {
        console.error('REDIS ERROR = ', error.name, error.message);
        this.error = error;
        this.redisClient.quit();
      });

      this.redisClient.on('end', () => {
        delete this.redisClient;
        delete this.error;
        console.log('CLEARED REDIS CLIENT');
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

  expireAsync(key, expire) {
    return promisifyOrResolve(this.getInstance(), 'expire', [key, expire]);
  },

  delAsync(key) {
    return promisifyOrResolve(this.getInstance(), 'del', [key]);
  },

  quitAsync() {
    return promisifyOrResolve(this.getInstance(), 'quit');
  },
};

module.exports = RedisManager;
