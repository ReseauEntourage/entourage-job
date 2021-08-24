import dotenv from 'dotenv';
import path from 'path';

/**
 * load environement variables located in ./.env or ./env.test depending on NODE_ENV
 */
const loadEnvironnementVariables = () => {
  const envPath =
    process.env.NODE_ENV === 'dev-test'
      ? '../../../.env.test'
      : '../../../.env';
  const completePath = path.resolve(__dirname, envPath);
  dotenv.config({ path: completePath });
};

export default loadEnvironnementVariables;
