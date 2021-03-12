const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const lessLoaderConfig = require('./lessLoaderConfig');
const { createMockMiddleware } = require('umi-mock-middleware');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      lessLoaderConfig('development'),
    ],
  },
  devServer: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.html' }],
    },
    disableHostCheck: true,
    hot: true,
    open: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    // 解析body，对接真实服务端环境需要注释掉
    before(app) {
      // var bodyParser = require("body-parser");
      // app.use(bodyParser.json());
      if (process.env.MOCK !== 'none') {
        app.use(createMockMiddleware());
      }
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
  },
  performance: {
    hints: false,
  },
  devtool: '#source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      inject: true,
    }),
  ],
});
