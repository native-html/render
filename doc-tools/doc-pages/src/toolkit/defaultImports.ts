import { ImportStmt } from './toolkit-types';

const defaultImports: Record<string, ImportStmt> = {
  react: {
    package: 'react',
    default: 'React'
  },
  'react-native': {
    package: 'react-native',
    named: ['useWindowDimensions']
  },
  '@native-html/render': {
    package: '@native-html/render',
    default: 'RenderHtml'
  }
};

export default defaultImports;
