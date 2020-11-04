const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const RedisManager = require('./RedisManager');

const dev = process.env.NODE_ENV !== 'production';

const RateLimiter = {
  createStore(prefix) {
    return new RedisStore({
      client: RedisManager.getInstance(),
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
