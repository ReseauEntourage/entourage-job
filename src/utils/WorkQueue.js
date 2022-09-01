import { JOBS } from 'src/constants';

import Queue from 'bull';

const dev = process.env.NODE_ENV !== 'production';

const getRedisOptions = () => {
  const redisUrl = process.env.REDIS_TLS_URL || process.env.REDIS_URL;

  if (redisUrl) {
    const redisURI = new URL(redisUrl);

    return {
      port: Number(redisURI.port),
      host: redisURI.hostname,
      username: redisURI.username,
      password: redisURI.password,
      db: 0,
      tls: {
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
      },
      enableOfflineQueue: false,
    };
  }
  return {};
};

const getMainWorkQueue = () => {
  if (dev && !process.env.DEBUG_JOBS) {
    return;
  }

  // https://devcenter.heroku.com/articles/securing-heroku-redis if needed
  return new Queue(JOBS.QUEUES.WORK, { redis: getRedisOptions() });
};

export { getMainWorkQueue };
