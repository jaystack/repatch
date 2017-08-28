import uglify from 'rollup-plugin-uglify';

import config from './rollup.config.js';

config.plugins.push(uglify());
config.output.file = config.output.file.replace(/\.js$/, '.min.js');

export default config;
