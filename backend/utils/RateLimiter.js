const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const dev = true; // process.env.NODE_ENV !== 'production';

const RateLimiter = {
  createStore(prefix) {
    const client = redis.createClient(
      process.env.REDIS_URL,
      {
        // required to prevent blocking when disconnected
        enable_offline_queue: false,

        // exponential backoff
        retry_strategy: (retry_params) => {
          let delay = (retry_params.attempt - 1) * 2; // seconds
          if (delay > 60) {
            delay = 60;
          }
          return delay * 1000; // milliseconds
        }
      }
    );

    // required to prevent exception throwing
    client.on('error', (error) => {})

    // fix attempts count when the connection closes before being ready
    client.on('connect', function() {
      this.attempts_on_connect = this.attempts
    })
    client.on('end', function() {
      if (!this.ready) {
        this.attempts = this.attempts_on_connect
      }
    })

    const store = new RedisStore({
      client,
      prefix,
    });

    // change behavior to fail open on errors
    store._incr = store.incr;
    store.incr = function(key, cb) {
      this._incr(key, function(err, current, resetTime) {
        if (err) {
          err = null
          current = 0
          resetTime = null
        }
        cb(err, current, resetTime);
      });
    }

    return store;
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
