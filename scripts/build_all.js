const { execSync } = require('child_process');

const build_render_engine = 'yarn build:transient-render-engine'
const build_css_processor = 'yarn build:css-processor'
const build_render_html = 'yarn build:render-html'
const build_pages = 'yarn workspace @doc/pages build'
const build_website = 'yarn workspace website build'

execSync(build_css_processor)
execSync(build_render_engine)
execSync(build_render_html)
execSync(build_pages)
execSync(build_website)
