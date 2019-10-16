const express = require('express');
const next = require('next');

const routeCV = require('./api/v1/CV');
const routeMessage = require('./api/v1/Message');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(express.json());
    server.use('/api/v1/cv', routeCV);
    server.use('/api/v1/message', routeMessage);

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
