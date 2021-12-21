import RedisManager from 'src/backend/utils/RedisManager';

import routeCV from 'src/backend/routes/api/v1/CV';
import routeAuth from 'src/backend/routes/api/v1/Auth';
import routeUser from 'src/backend/routes/api/v1/User';
import routeMail from 'src/backend/routes/api/v1/Mail';
import routeOpportunity from 'src/backend/routes/api/v1/Opportunity';

import RateLimiter from 'src/backend/utils/RateLimiter';
import { loggerMiddleware } from 'src/backend/utils/Logger';
import { REDIS_KEYS } from 'src/constants';

import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import express from 'express';
import enforce from 'express-sslify';
import cors from 'cors';
import { jwtMiddleware } from 'src/backend/controllers/Auth';

const app = express();
const dev = process.env.NODE_ENV !== 'production';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],

  tracesSampleRate: 1.0,
});

let server;

const apiLimiter = RateLimiter.createLimiter(REDIS_KEYS.RL_GENERAL, 100);

export default {
  prepare: () => {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());

    // enable ssl redirect
    if (!dev) app.use(enforce.HTTPS({ trustProtoHeader: true }));
    app.use(
      cors({
        origin: process.env.SERVER_URL,
      })
    );

    app.set('trust proxy', 1);

    app.use(express.json());

    const apiTimeout = process.env.SERVER_TIMEOUT
      ? parseInt(process.env.SERVER_TIMEOUT, 10)
      : 30000;

    app.use((req, res, next) => {
      // Set the timeout for all HTTP requests
      req.setTimeout(apiTimeout, () => {
        const err = new Error('Request Timeout');
        err.status = 408;
        next(err);
      });
      // Set the server response timeout for all HTTP requests
      res.setTimeout(apiTimeout, () => {
        const err = new Error('Service Unavailable');
        err.status = 503;
        next(err);
      });
      next();
    });

    app.use(jwtMiddleware(false));

    app.use(loggerMiddleware());

    // adding routes
    app.use('/api/v1/auth', apiLimiter, routeAuth);
    app.use('/api/v1/cv', apiLimiter, routeCV);
    app.use('/api/v1/mail', apiLimiter, routeMail);
    // app.use('/api/v1/message', apiLimiter, routeMessage);
    app.use('/api/v1/opportunity', apiLimiter, routeOpportunity);
    app.use('/api/v1/user', apiLimiter, routeUser);

    app.use(Sentry.Handlers.errorHandler());

    app.use((err, req, res, next) => {
      if (err) {
        return res.status(err.status || 500).send({
          message: err.message,
          errorId: res.sentry,
        });
      }
      next();
    });

    return app;
  },

  get: (path, handle) => {
    app.get(path, handle);
  },

  start: (port) => {
    return new Promise((resolve, reject) => {
      server = app.listen(port, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`> Site disponible sur http://localhost:${port}`);
          resolve();
        }
      });
    });
  },

  close: async () => {
    if (!server) throw 'The express server is not started'; // eslint-disable-line no-throw-literal
    await RedisManager.quitAsync();
    await server.close();
  },
};
