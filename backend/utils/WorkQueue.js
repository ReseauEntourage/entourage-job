const Queue = require('bull');
const { JOBS } = require('../../constants');

const dev = process.env.NODE_ENV !== 'production';

const getMainWorkQueue = () => {
  if (dev) {
    return;
  }

  const redisURI = new URL(process.env.REDIS_TLS_URL);

  // https://devcenter.heroku.com/articles/securing-heroku-redis if needed
  return new Queue(JOBS.QUEUES.WORK, {
    redis: {
      port: Number(redisURI.port),
      host: redisURI.hostname,
      password: redisURI.password,
      db: 0,
      tls: {
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
      },
    },
  });
};

const getImageQueue = () => {
  if (dev) {
    return;
  }

  const redisURI = new URL(process.env.REDIS_TLS_URL);

  // https://devcenter.heroku.com/articles/securing-heroku-redis if needed
  return new Queue(JOBS.QUEUES.IMAGE, {
    redis: {
      port: Number(redisURI.port),
      host: redisURI.hostname,
      password: redisURI.password,
      db: 0,
      tls: {
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
      },
    },
  });
};

module.exports = {
  getMainWorkQueue,
  getImageQueue,
};
