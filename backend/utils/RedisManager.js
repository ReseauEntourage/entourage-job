const redis = require('redis');
const { promisify } = require('util');

const RedisManager = {
  getInstance() {
    if (!this.redisClient) {
      this.redisClient = redis.createClient(process.env.REDIS_URL);

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
    const getAsync = promisify(this.getInstance().get).bind(this.getInstance());
    return getAsync(key);
  },

  setAsync(key, value) {
    const setAsync = promisify(this.getInstance().set).bind(this.getInstance());
    return setAsync(key, value);
  },

  expireAsync(key, expire) {
    const expireAsync = promisify(this.getInstance().expire).bind(
      this.getInstance()
    );
    return expireAsync(key, expire);
  },

  delAsync(key) {
    const delAsync = promisify(this.getInstance().del).bind(this.getInstance());
    return delAsync(key);
  },

  quitAsync() {
    const quitAsync = promisify(this.getInstance().quit).bind(
      this.getInstance()
    );
    return quitAsync();
  },
};

module.exports = RedisManager;
