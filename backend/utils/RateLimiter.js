const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const RedisManager = require('./RedisManager');

const dev = process.env.NODE_ENV !== 'production';

const RateLimiter = {
  createStore(prefix) {
    const store = new RedisStore({
      client: RedisManager.getInstance('rate-limiter'),
      prefix,
    });

    // change behavior to fail open on errors
    store._incr = store.incr;
    store.incr = (key, cb) => {
      this._incr(key, (err, current, resetTime) => {
        if (err) {
          err = null;
          current = 0;
          resetTime = null;
        }
        cb(err, current, resetTime);
      });
    };

    return store;
  },

  createLimiter(prefix, max) {
    if (!dev) {
      return new RateLimit({
        store: this.createStore(prefix),
        max,
      });
    }

    return (req, res, next) => {
      return next();
    };
  },
};

module.exports = RateLimiter;
