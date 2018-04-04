const path = require('path')
// const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')

module.exports = merge(baseWebpackConfig, {
  entry: {
    index: [
      './examples/index.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    // publicPath: '/',
    publicPath: '/ant-design/',
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          { loader: 'less-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    // historyApiFallback: {
    //   rewrites: [
    //     { from: /.*/, to: '/index.html' },
    //   ],
    // },
    historyApiFallback: {
      rewrites: [
        { from: /./, to: '/ant-design/index.html' },
      ],
    },
    disableHostCheck: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  performance: {
    hints: false,
  },
  devtool: '#source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'site/index.html',
      filename: 'index.html',
      inject: true,
    }),
  ],
})
