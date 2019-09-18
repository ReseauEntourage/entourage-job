const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    "use_env_variable": "DATABASE_URL"
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres'
  },
  production: {
    "use_env_variable": "DATABASE_URL"
  }
};