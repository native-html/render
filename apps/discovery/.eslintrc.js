const defaultConf = require('../../.eslintrc.js');
module.exports = {
  ...defaultConf,
  rules: {
    ...defaultConf.rules,
    '@typescript-eslint/no-shadow': 'off',
    'react-native/no-inline-styles': 'off',
    'react/no-unstable-nested-components': 'off',
  }
};
