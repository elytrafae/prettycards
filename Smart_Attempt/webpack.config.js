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
        updateURL: `https://github.com/elytrafae/${package.name}/releases/latest/download/${package.name}.user.js`,
        //downloadURL: `https://unpkg.com/${package.name}/dist/${package.name}.user.js`,
		    downloadURL: `https://github.com/elytrafae/prettycards/releases/latest/download/prettycards.user.js`,
        require: [
          'https://raw.githubusercontent.com/UCProjects/UnderScript/master/src/checkerV2.js',
        ],
        grant: 'none',
        "run-at" : "document-idle"
      },
      pretty: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: "css-loader",
        options: {
          modules: false,
          url: false
        }
      },
    ],
  },
};
