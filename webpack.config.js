const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: './examples/index.js',
  },
  module: {
    rules: [
      {
        test: /\.(vue|md)$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /pickr.*js/,
        options: {
          presets: [
            [
              'env',
              {
                targets: {
                  browsers: [
                    'last 2 versions',
                    'Firefox ESR',
                    '> 1%',
                    'ie >= 9',
                    'iOS >= 8',
                    'Android >= 4',
                  ],
                },
              },
            ],
          ],
          plugins: [
            'transform-vue-jsx',
            'transform-object-assign',
            'transform-object-rest-spread',
            'transform-class-properties',
          ],
        },
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
        use: [
          { loader: 'vue-style-loader' },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: true,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      'ant-design-vue': path.join(__dirname, './components'),
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['.js', '.jsx', '.vue', '.md'],
  },
  devServer: {
    host: 'localhost',
    port: 3002,
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.html' }],
    },
    disableHostCheck: true,
    hot: true,
    open: true,
  },
  devtool: '#source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'examples/index.html',
      filename: 'index.html',
      inject: true,
    }),
    new VueLoaderPlugin(),
    new WebpackBar(),
  ],
};
