const { getDefaultConfig } = require('expo/metro-config');

const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const packagesRoot = path.resolve(projectRoot, '../../packages');
const docToolsRoot = path.resolve(projectRoot, '../../doc-tools');

const packagesDirs = fs.readdirSync(packagesRoot);
const docToolsDirs = fs.readdirSync(docToolsRoot);

const config = getDefaultConfig(projectRoot);

config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true,
    // Need this for source mapping in @doc/pages to work.
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      // Need this for source mapping in @doc/pages to work.
      keep_fnames: true
    },
    output: {
      ascii_only: true,
      quote_style: 3,
      wrap_iife: true
    },
    sourceMap: {
      includeSources: false
    },
    toplevel: false,
    compress: {
      // reduce_funcs inlines single-use functions, which cause perf regressions.
      reduce_funcs: false
    }
  },
  babelTransformerPath: require.resolve('react-native-svg-transformer')
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  nodeModulesPaths: [
    ...config.resolver.nodeModulesPaths,
    ...packagesDirs.map((d) =>
      path.resolve(packagesRoot, d, 'node_modules')
    ),
    ...docToolsDirs.map((d) =>
      path.resolve(docToolsRoot, d, 'node_modules')
    )
  ]
};

module.exports = config;
