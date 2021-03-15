const loadEnvironementVariables = require('../../utils/env');

loadEnvironementVariables();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    seederStorage: 'sequelize',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    seederStorage: 'sequelize',
    dialect: 'postgres',
    native: true,
    dialectOptions: {
      native: true,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  'dev-test': {
    use_env_variable: 'DATABASE_URL',
    seederStorage: 'sequelize',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    seederStorage: 'sequelize',
    dialect: 'postgres',
    native: true,
    dialectOptions: {
      native: true,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
