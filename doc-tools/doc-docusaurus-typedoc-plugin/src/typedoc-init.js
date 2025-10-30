//@ts-check

// Forked from https://github.com/TypeStrong/typedoc/blob/master/bin/typedoc
const td = require('typedoc');

/**
 * @param {import('typedoc').TypeDocOptions} options
 * @returns {Promise<import('typedoc').Application>}
 */
module.exports = async function init(options) {
  const app = await td.Application.bootstrapWithPlugins(options);
  return app;
};
