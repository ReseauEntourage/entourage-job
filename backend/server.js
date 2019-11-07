const express = require('express');
const session = require('express-session');
const routeCV = require('./routes/api/v1/CV');
const routeMessage = require('./routes/api/v1/Message');
const routeAuth = require('./routes/Auth');

const app = express();
let server;

module.exports.prepare = () => {
  app.use(express.json());
  app.use(
    session({
      secret: 'entouragejobs-passport',
      cookie: { maxAge: 60000 },
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use('/api/v1/cv', routeCV);
  app.use('/api/v1/message', routeMessage);
  app.use('/auth', routeAuth);
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
  if (server) throw 'The express server is not started'; // eslint-disable-line no-throw-literal
  server.close();
};
