const express = require('express');
const enforce = require('express-sslify');

const passport = require('./config/passport');

const routeCV = require('./routes/api/v1/CV');
const routeAuth = require('./routes/api/v1/Auth');
const routeUser = require('./routes/api/v1/User');
const routeMail = require('./routes/api/v1/Mail');
const routeOpportunity = require('./routes/api/v1/Opportunity');

const RateLimiter = require('./utils/RateLimiter');

const app = express();
const dev = process.env.NODE_ENV !== 'production';

let server;

const apiLimiter = dev ? (req, res, next) => next() : RateLimiter.createLimiter(100);

module.exports.prepare = () => {

  // enable ssl redirect
  if (!dev) app.use(enforce.HTTPS({trustProtoHeader: true}));

  app.set('trust proxy', 1);

  app.use(express.json());

  // adding Passport
  app.use(passport.initialize());


  const apiTimeout = process.env.SERVER_TIMEOUT ? parseInt(process.env.SERVER_TIMEOUT, 10) : 30000;

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

  // adding routes
  app.use('/api/v1/auth', apiLimiter, routeAuth);
  app.use('/api/v1/cv', apiLimiter, routeCV);
  app.use('/api/v1/mail', apiLimiter, routeMail);
  // app.use('/api/v1/message', apiLimiter, routeMessage);
  app.use('/api/v1/opportunity', apiLimiter, routeOpportunity);
  app.use('/api/v1/user', apiLimiter, routeUser);

  app.use((err, req, res, next) => {
    if (err) {
      return res.status(err.status).send({message: err.message});
    }
    next();
  });

  return app;
};

module.exports.get = (path, handle) => {
  app.get(path, handle);
};

module.exports.start = (port) => {
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
};

module.exports.close = async () => {
  if (!server) throw 'The express server is not started'; // eslint-disable-line no-throw-literal
  await server.close();
};
