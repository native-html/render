module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testRegex: 'src/.*\\.test\\.ts$',
  coveragePathIgnorePatterns: ['/node_modules/', '__tests__'],
  transformIgnorePatterns: [
    'node_modules/(?!(change-case)/)'
  ],
};
