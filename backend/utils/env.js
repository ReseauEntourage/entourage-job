const dotenv = require('dotenv');
const path = require('path');

/**
 * load envionement vairables located in ./.env or ./env.test depending on NODE_ENV
 */
const loadEnvironnementVariables = () => {
    const envPath = process.env.NODE_ENV === 'test' ? '../../.env.test' : '../../.env';
    dotenv.config({ path: path.resolve(__dirname, envPath) });
    console.log('ENV: ', process.env.NODE_ENV);
    console.log('ENV PATH', path.resolve(__dirname, envPath));
    console.log('ENV PORT', process.env.PORT);
}

module.exports = loadEnvironnementVariables;