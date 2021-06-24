const Queue = require('bull');
const { JOBS } = require('../../constants');

const dev = process.env.NODE_ENV !== 'production';

const getRedisOptions = () => {
  const redisURI = new URL(process.env.REDIS_TLS_URL);
  return {
    port: Number(redisURI.port),
    host: redisURI.hostname,
    password: redisURI.password,
    db: 0,
    tls: {
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
    },
    enableOfflineQueue: false,
  };
};

const getMainWorkQueue = () => {
  if (dev) {
    return;
  }

  // https://devcenter.heroku.com/articles/securing-heroku-redis if needed
  return new Queue(JOBS.QUEUES.WORK, { redis: getRedisOptions() });
};

const getImageQueue = () => {
  if (dev) {
    return;
  }

  // https://devcenter.heroku.com/articles/securing-heroku-redis if needed
  return new Queue(JOBS.QUEUES.IMAGE, { redis: getRedisOptions() });
};

module.exports = {
  getMainWorkQueue,
  getImageQueue,
};
