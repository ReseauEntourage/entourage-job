import { prepareServer, startServer } from 'src/server';

try {
  prepareServer();
  startServer().then(() => {
    console.log('LinkedOut backend started');
  });
} catch (err) {
  console.log('Error starting LinkedOut backend', err);
}
