const redis = require('redis');

const dev = process.env.NODE_ENV !== 'production';

const promisifyOrResolve = (instance, func, args = []) => {
  if (instance) {
    return new Promise((resolve, reject) => {
      instance[func](...args, (error, result) => {
        if (error === null) {
          resolve(result);
        } else {
          resolve();
        }
      });
    });
  }
  return Promise.resolve();
};

const RedisManager = {
  getInstance(name = 'default') {
    if (dev) {
      return null;
    }

    this.clients = this.clients || {};

    if (!this.clients[name]) {
      this.clients[name] = this.createClient(name);
    }

    return this.clients[name];
  },

  createClient(name) {
    const client = redis.createClient(process.env.REDIS_URL, {
      // required to prevent blocking when disconnected
      enable_offline_queue: false,

      // exponential backoff
      retry_strategy: (retry_params) => {
        let delay = (retry_params.attempt - 1) * 2; // seconds
        if (delay > 60) {
          delay = 60;
        }
        return delay * 1000; // milliseconds
      },
    });

    client.name = name;
    client.lastError = null;

    client.on('connect', function () {
      // used to fix attempts count in on('end')
      this.attemptsOnConnect = this.attempts;
    });

    client.on('ready', function () {
      this.lastError = null;
      this.attempts = 1; // reset attempts
      this.attemptsOnConnect = null;
      console.log(`type=redis.ready client=${this.name}`);
      this.client('SETNAME', `${process.env.DYNO || 'app'}/${this.name}`);
    });

    // an error handler is required to prevent exception throwing
    client.on('error', function (error) {
      if (error) {
        this.lastError = error;
      }
      // the client can't be used anymore once it is 'closed' so we delete it
      if (this.closing && RedisManager.clients[this.name] === this) {
        console.log(
          `type=redis.destroy client=${this.name} reason=error last_error:`,
          this.lastError
        );
        delete RedisManager.clients[this.name];
      }
    });

    client.on('end', function () {
      // fix attempts count when the connection closes before being ready
      if (!this.ready && this.attemptsOnConnect) {
        this.attempts = this.attemptsOnConnect;
      }

      // the client can't be used anymore once it is 'closed' so we delete it
      if (this.closing && RedisManager.clients[this.name] === this) {
        console.log(
          `type=redis.destroy client=${this.name} reason=end last_error:`,
          this.lastError
        );
        delete RedisManager.clients[this.name];
      }

      if (!this.lastError) {
        this.lastError = new Error('Connection lost without error (end).');
      }
    });

    client.on('reconnecting', function (params) {
      if (params.error) {
        this.lastError = params.error;
      }
      console.log(
        `type=redis.reconnecting client=${this.name} attempt=${
          this.attempts
        } last_error="${this.lastError ? this.lastError.message : null}"`
      );
    });

    return client;
  },

  getAsync(key) {
    return promisifyOrResolve(this.getInstance('cache'), 'get', [key]);
  },

  setAsync(key, value) {
    return promisifyOrResolve(this.getInstance('cache'), 'set', [key, value]);
  },

  setWithExpireAsync(key, value, expire) {
    return promisifyOrResolve(this.getInstance('cache'), 'setex', [
      key,
      expire,
      value,
    ]);
  },

  delAsync(key) {
    return promisifyOrResolve(this.getInstance('cache'), 'del', [key]);
  },

  quitAsync() {
    return promisifyOrResolve(this.getInstance('cache'), 'quit');
  },
};

module.exports = RedisManager;
