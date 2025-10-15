module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testRegex: 'src/.*\\.test\\.tsx?$',
  coveragePathIgnorePatterns: ['/node_modules/', '__tests__'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-webview|ramda|react-native-render-html|@react-native)/)'
  ],
  setupFiles: ['<rootDir>/jest/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest/setupAfterEnv.ts']
};
