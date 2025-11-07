const { getDefaultConfig } = require('expo/metro-config');

const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const packagesRoot = path.resolve(projectRoot, '../../packages');
const docToolsRoot = path.resolve(projectRoot, '../../doc-tools');

const packagesDirs = fs.readdirSync(packagesRoot);
const docToolsDirs = fs.readdirSync(docToolsRoot);

const config = getDefaultConfig(projectRoot);

// Watch folders for monorepo packages
config.watchFolders = [
  projectRoot,
  packagesRoot,
  ...packagesDirs.map((d) => path.resolve(packagesRoot, d)),
  ...docToolsDirs.map((d) => path.resolve(docToolsRoot, d))
];

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    // Deduplicate React and React-Native to avoid "Invalid hook call" errors
    'react': path.resolve(projectRoot, 'node_modules/react'),
    'react-dom': path.resolve(projectRoot, 'node_modules/react-dom'),
    'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
    // Map workspace packages to their source directories
    'react-native-render-html': path.resolve(packagesRoot, 'render-html/src'),
    '@native-html/transient-render-engine': path.resolve(packagesRoot, 'transient-render-engine/src'),
    '@native-html/css-processor': path.resolve(packagesRoot, 'css-processor/src'),
    // Map dependencies from workspace root
    '@jsamr/counter-style': path.resolve(workspaceRoot, 'node_modules/@jsamr/counter-style'),
    '@jsamr/react-native-li': path.resolve(workspaceRoot, 'node_modules/@jsamr/react-native-li'),
    'csstype': path.resolve(workspaceRoot, 'node_modules/csstype'),
    'domelementtype': path.resolve(workspaceRoot, 'node_modules/domelementtype'),
    'domhandler': path.resolve(workspaceRoot, 'node_modules/domhandler'),
    'domutils': path.resolve(workspaceRoot, 'node_modules/domutils'),
    'htmlparser2': path.resolve(workspaceRoot, 'node_modules/htmlparser2'),
    'ramda': path.resolve(workspaceRoot, 'node_modules/ramda'),
    'css-to-react-native': path.resolve(workspaceRoot, 'node_modules/css-to-react-native'),
    'urijs': path.resolve(workspaceRoot, 'node_modules/urijs'),
  },
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'), // Add root monorepo node_modules
    ...packagesDirs.map((d) =>
      path.resolve(packagesRoot, d, 'node_modules')
    ),
    ...docToolsDirs.map((d) =>
      path.resolve(docToolsRoot, d, 'node_modules')
    )
  ]
};

module.exports = config;
