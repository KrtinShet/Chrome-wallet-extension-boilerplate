// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('../webpack.config');
const env = require('./env');
const path = require('path');

const options = config.chromeExtensionBoilerplate || {};
const excludeEntriesToHotReload = options.notHotReload || [];

for (let entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + env.PORT,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || []
);

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  hot: true,
  port: env.PORT,
  injectClient: false,
  https: false,
  contentBase: path.join(__dirname, '../dist'),
  headers: { 'Access-Control-Allow-Origin': '*' },  
  disableHostCheck: true,
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

server.listen(env.PORT);
