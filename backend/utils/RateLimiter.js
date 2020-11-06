const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const dev = true; // process.env.NODE_ENV !== 'production';

const RateLimiter = {
  createStore(prefix) {
    return new RedisStore({
      redisURL: process.env.REDIS_URL,
      prefix,
    });
  },

  createLimiter(prefix, max) {
    if (!dev) {
      return new RateLimit({
        store: this.createStore(prefix),
        max,
      });
    }

    return (req, res, next) => next();
  },
};

module.exports = RateLimiter;
