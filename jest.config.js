// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  roots: ['<rootDir>/test'],
  testRegex: '.+\\.(test|spec)\\.js?$',
  testEnvironment: 'node',
  maxConcurrency: 5,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['backend/**/*.js'],
  verbose: true,
};
