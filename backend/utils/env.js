const dotenv = require('dotenv');
const path = require('path');

/**
 * load envionement vairables located in ./.env or ./env.test depending on NODE_ENV
 */
const loadEnvironnementVariables = () => {
    const envPath = process.env.NODE_ENV === 'dev-test' ? '../../.env.test' : '../../.env';
    dotenv.config({ path: path.resolve(__dirname, envPath) });
};

module.exports = loadEnvironnementVariables;
