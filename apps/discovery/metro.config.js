const path = require('path');
// const fs = require('fs');
const { getDefaultConfig } = require('expo/metro-config');

const workspaceRoot = path.resolve(__dirname, '../..');
// const packagesRoot = path.resolve(__dirname, '../../packages');
// const docToolsRoot = path.resolve(__dirname, '../../doc-tools');

// const packagesDirs = fs.readdirSync(packagesRoot);
// const docToolsDirs = fs.readdirSync(docToolsRoot);

// const watchFolders = [
//   workspaceRoot,
//   ...packagesDirs.map((f) => path.join(packagesRoot, f)),
//   ...docToolsDirs.map((f) => path.join(docToolsRoot, f))
// ];

module.exports = (async () => {
  const {
    resolver: { assetExts, sourceExts },
    transformer,
    ...other
  } = await getDefaultConfig(workspaceRoot);
  return {
    ...other,
    resetCache: true,
    // projectRoot: workspaceRoot,
    // watchFolders,
    transformer: {
      ...transformer,
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
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      // extraNodeModules: new Proxy(
      //   {},
      //   {
      //     get: (target, name) => path.join(__dirname, `node_modules/${name}`)
      //   }
      // )
    }
  };
})();
