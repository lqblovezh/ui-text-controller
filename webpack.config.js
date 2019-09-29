const projectName = require('project-name')
const path = require('path')
const webpackMerge = require('webpack-merge')
const MinifyPlugin = require('babel-minify-webpack-plugin');

const minify = new MinifyPlugin({
  booleans: false,
  infinity: false,
  removeConsole: true,
  removeDebugger: true,
})


function resolve(dir) {
  return path.resolve(__dirname, dir)
}

const baseConfig = {
  entry: resolve('src/index.es'),
  module: {
    rules: [
      {
        test: /(\.es)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: ['ie 9']
                }
              }], 'stage-0'
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.es', '.js', '.json']
  },
};

module.exports = process.env.NODE_ENV === 'production' ? [
  webpackMerge(baseConfig, {
    output: {
      path: resolve('dist'),
      filename: projectName() + ".js",
      library: 'UITextController',
      libraryTarget: 'window',
    },
    devtool: 'source-map',
  }),
  webpackMerge(baseConfig, {
    output: {
      path: resolve('dist'),
      filename: projectName() + ".min.js",
      library: 'UITextController',
      libraryTarget: 'window',
    },
    plugins: [minify],
  }),
  webpackMerge(baseConfig, {
    output: {
      path: resolve('dist'),
      filename: projectName() + ".esm.bundle.js",
      libraryTarget: 'commonjs2',
    },
  }),
] : webpackMerge(baseConfig, {
  output: {
    path: resolve('dist'),
    filename: projectName() + ".js",
    library: 'UITextController',
    libraryTarget: 'window',
  },
  devtool: 'eval-source-map',
  devServer: {
    hot: false,
    inline: false,
    open: !true,
    host: '0.0.0.0',
    contentBase: './test'
  }
})
