import RedisManager from 'src/backend/utils/RedisManager';

import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

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
      store._incr(key, (err, current, resetTime) => {
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

export default RateLimiter;
