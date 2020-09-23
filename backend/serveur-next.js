const next = require('next');
const server = require('./server');

const PORT = process.env.PORT || 3001;
const dev = process.env.NODE_ENV !== 'production';

const app = next({dev});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    server.prepare();
    server.get('*', handle);
    server.start(PORT);
    server.setTimeout(process.env.SERVER_TIMEOUT || 30000)
  })
  .catch((ex) => {
    server.close();
    console.error(ex.stack);
    process.exit(1);
  });
