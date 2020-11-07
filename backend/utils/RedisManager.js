const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

const dev = true; /* process.env.NODE_ENV !== 'production'; */

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
      this.redisClient.uuid = uuidv4();
      console.log(`type=redis.create id=${this.redisClient.uuid}`);

      this.redisClient.on('connect', function() { console.log(`type=redis.connected id=${this.uuid}`); });
      this.redisClient.on('ready', function() { console.log(`type=redis.ready id=${this.uuid}`); });
      this.redisClient.on('reconnecting', function(reconnecting_params) { console.log(`type=redis.reconnecting params=${reconnecting_params} id=${this.uuid}`); });

      this.redisClient.on('error', function(error) {
        console.log(`type=redis.error name=${error.name} message="${error.message}" closing=${this.closing} id=${this.uuid}`, error);

        if (this.closing) {
          // the connection is closed, we must create new client.
          console.error(`type=redis.delete context=error id=${this.uuid}`);
          if (RedisManager.redisClient === this) {
            delete RedisManager.redisClient;
          }
        }
      });

      this.redisClient.on('end', function() {
        console.log(`type=redis.disconnected closing=${this.closing} id=${this.uuid}`);

        if (this.closing) {
          // the connection is closed, we must create new client.
          console.error(`type=redis.delete context=disconnected id=${this.uuid}`);
          if (RedisManager.redisClient === this) {
            delete RedisManager.redisClient;
          }
        }
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
