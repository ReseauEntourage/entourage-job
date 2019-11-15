const express = require('express');
const session = require('express-session');
const uid = require('uid-safe');
const passport = require('./config/passport');

const routeCV = require('./routes/api/v1/CV');
const routeMessage = require('./routes/api/v1/Message');
const routeAuth = require('./routes/Auth');
const routeUser = require('./routes/api/v1/User');
const routeMail = require('./routes/Mail');

const app = express();
let server;

module.exports.prepare = () => {
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
  app.use('/api/v1/cv', routeCV);
  app.use('/api/v1/message', routeMessage);
  app.use('/api/v1/user', routeUser);
  app.use('/auth', routeAuth);

  // restricting access to some routes
  // const restrictAccess = (req, res, next) => {
  //   console.log(`restrictAccess : ${req.isAuthenticated()}`);

  //   if (!req.isAuthenticated()) return res.redirect('/login');
  //   return next();
  // };

  // app.use('/profile', restrictAccess);
  // app.use('/logout', restrictAccess);
  app.use('/mail', routeMail);
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
  server.close();
};
