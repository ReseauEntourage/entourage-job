// const dotenv = require('dotenv');

// dotenv.config();
const loadEnvironementVariables = require('../../utils/env');

loadEnvironementVariables();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    seederStorage: 'sequelize',
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    seederStorage: 'sequelize',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    seederStorage: 'sequelize',
    dialect: 'postgres'
  },
};
