const redis = require('redis');
const { promisify } = require('util');

const dev = process.env.NODE_ENV !== 'production';

const promisifyHelper = (instance, func, args) => {
  const asyncFunc = promisify(instance[func]).bind(instance);
  if (args) {
    return asyncFunc(...args);
  }
  return asyncFunc();
};

const getInstanceAndPromiseOrResolve = async (getInstance, func, args) => {
  if (dev) {
    try {
      const instance = await getInstance();
      return promisifyHelper(instance, func, args);
    } catch (e) {
      console.error(e);
      return Promise.resolve();
    }
  }
  return Promise.resolve();
};

const RedisManager = {
  getInstance() {
    return new Promise((res, rej) => {
      if (!this.redisClient) {
        this.redisClient = redis.createClient(process.env.REDIS_URL);
        console.log('Redis client created.');

        this.redisClient.on('ready', () => {
          console.log('Redis client ready.');
          res(this.redisClient);
        });

        this.redisClient.on('connect', () => {
          console.log('Redis client connected.');
        });

        this.redisClient.on('ends', () => {
          console.log('Redis client disconnected.');
          delete this.redisClient;
        });

        this.redisClient.on('error', (error) => {
          console.log('Redis client error.');
          console.error('REDIS ERROR = ', error.name, error.message);
          delete this.redisClient;
          rej(error);
        });
      } else {
        res(this.redisClient);
      }
    });
  },

  getAsync(key) {
    return getInstanceAndPromiseOrResolve(this.getInstance, 'get', [key]);
  },

  setAsync(key, value) {
    return getInstanceAndPromiseOrResolve(this.getInstance, 'set', [
      key,
      value,
    ]);
  },

  expireAsync(key, expire) {
    return getInstanceAndPromiseOrResolve(this.getInstance, 'expire', [
      key,
      expire,
    ]);
  },

  delAsync(key) {
    return getInstanceAndPromiseOrResolve(this.getInstance, 'del', [key]);
  },

  quitAsync() {
    return getInstanceAndPromiseOrResolve(this.getInstance, 'quit');
  },
};

module.exports = RedisManager;
