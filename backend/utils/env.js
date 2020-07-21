const dotenv = require('dotenv');
const path = require('path');

/**
 * load envionement vairables located in ./.env or ./env.test depending on NODE_ENV
 */
export default () => {
    const envPath = process.env.NODE_ENV === 'test' ? '../../.env.test' : '../../.env';
    console.log('ENV PATH', envPath);
    dotenv.config({ path: path.resolve(__dirname, envPath) });
}