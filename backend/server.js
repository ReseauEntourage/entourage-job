const express = require('express');
const session = require('express-session');
const uid = require('uid-safe');
const enforce = require('express-sslify');
const passport = require('./config/passport');

const routeCV = require('./routes/api/v1/CV');
const routeAuth = require('./routes/api/v1/Auth');
const routeUser = require('./routes/api/v1/User');
const routeMail = require('./routes/api/v1/Mail');
const routeOpportunity = require('./routes/api/v1/Opportunity');

const app = express();

let server;

module.exports.prepare = () => {

  const dev = process.env.NODE_ENV !== 'production';

  // enable ssl redirect
  if (!dev) app.use(enforce.HTTPS({ trustProtoHeader: true }));

  app.use(express.json());

  // add session management to Express
  app.use(
    session({
      secret: uid.sync(18),
      // secret: 'entouragejobs-passport',
      cookie: {
        // maxAge: 60000,
        maxAge: 86400 * 1000, // 24 hours in milliseconds
      },
      resave: false,
      saveUninitialized: false,
    })
  );

  // adding Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // adding routes
  app.use('/api/v1/auth', routeAuth);
  app.use('/api/v1/cv', routeCV);
  app.use('/api/v1/mail', routeMail);
  // app.use('/api/v1/message', routeMessage);
  app.use('/api/v1/opportunity', routeOpportunity);
  app.use('/api/v1/user', routeUser);

  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(err.status).send({ message: err.message });
      return;
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
      if (err) reject(err);
      else {
        console.log(`> Site disponible sur http://localhost:${port}`);
        resolve();
      }
    });
  });
};

module.exports.close = () => {
  if (!server) throw 'The express server is not started'; // eslint-disable-line no-throw-literal
  return new Promise((resolve) => server.close(resolve));
};
