const path = require('path');
const WebpackUserscript = require('webpack-userscript');
const package = require('./package.json');

const dev = process.argv.includes('--dev');

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: {
    [`${package.name}`] : path.resolve(__dirname, 'src', 'index.js'),
    [`${package.name}_lite`] : path.resolve(__dirname, 'src', 'index_lite.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `[name].user.js`,
    //libraryTarget: 'this',
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        name: 'PrettyCards',
        match: 'https://*.undercards.net/*',
        exclude: 'https://*.undercards.net/*/*',
        //updateURL: `https://unpkg.com/${package.name}/dist/${package.name}.meta.js`,
        updateURL: `https://github.com/CMD-God/${package.name}/releases/latest/download/${package.name}.user.js`,
        //downloadURL: `https://unpkg.com/${package.name}/dist/${package.name}.user.js`,
		downloadURL: `https://github.com/CMD-God/prettycards/releases/latest/download/prettycards.user.js`,
        require: [],
        grant: 'none',
        "run-at" : "document-idle" 
      },
      pretty: true,
    }),
  ],
};
