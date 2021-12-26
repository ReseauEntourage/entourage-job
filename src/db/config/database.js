import loadEnvironementVariables from 'src/utils/env';

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
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
