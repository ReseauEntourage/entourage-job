const tracer = require('dd-trace').init();
const next = require('next');

const loadEnvironementVariables = require('./utils/env');

loadEnvironementVariables();

const server = require('./server');

const PORT = process.env.PORT || 3001;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    server.prepare();
    server.get('*', handle);
    server.start(PORT);
  })
  .catch((ex) => {
    server.close();
    console.error(ex.stack);
    process.exit(1);
  });

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close().then(() => {
    console.log('HTTP server closed');
  });
});
