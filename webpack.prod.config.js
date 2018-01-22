const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const modulePlugin = new ExtractTextPlugin({
  filename: '[name].[chunkhash].css',
  allChunks: true,
})

module.exports = {
  entry: {
    index: [
      './examples/index.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].async.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader', exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.less$/,
        use: modulePlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            { loader: 'less-loader',
            },
          ],
        }),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'antd': path.join(__dirname, 'components'),
    },
  },
}
// http://vue-loader.vuejs.org/en/workflow/production.html
module.exports.plugins = (module.exports.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vender',
    minChunks: function (module) {
      return module.context && ~module.context.indexOf('node_modules')
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  }),
  new HtmlWebpackPlugin({
    template: './examples/index.html',
    inject: true,
    minify: { collapseWhitespace: true },
    production: true,
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
  modulePlugin,
  new WebpackChunkHash({ algorithm: 'md5' }),
])
