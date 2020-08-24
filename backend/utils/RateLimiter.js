const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');


class RateLimiter {
  getStore() {
    if(!this.redisStore) {
      this.redisStore = new RedisStore({
        redisURL: process.env.REDIS_URL
      });
    }
    return this.redisStore;
  }

  createLimiter(max)  {
    return new RateLimit({
      store: this.getStore(),
      max
    });
  }
}

module.exports = new RateLimiter();
