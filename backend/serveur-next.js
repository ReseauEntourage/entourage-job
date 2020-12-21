const loadEnvironementVariables = require('./utils/env');

loadEnvironementVariables();

const tracer = process.env.ENABLE_DATADOG ? require('dd-trace').init() : null;
const next = require('next');

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
