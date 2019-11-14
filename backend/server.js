const express = require('express');
const routeCV = require('./routes/api/v1/CV');
const routeMessage = require('./routes/api/v1/Message');
const routeMail = require('./routes/Mail');

const app = express();
let server;

module.exports.prepare = () => {
  app.use(express.json());
  app.use('/api/v1/cv', routeCV);
  app.use('/api/v1/message', routeMessage);
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
  server.close();
};
