module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  moduleNameMapper: {
    '@native-html/css-processor': '<rootDir>/../css-processor/src'
  },
  testRegex: 'src/.*\\.test\\.ts$',
  coveragePathIgnorePatterns: ['/node_modules/', '__tests__', 'jest'],
  snapshotSerializers: ['./jest/tnodeSerializer.js'],
  modulePaths: ['<rootDir>']
};
