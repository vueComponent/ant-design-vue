const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = function(env) {
  const isDev = env === 'development';
  return {
    test: /\.less$/,
    oneOf: [
      /* config.module.rule('less').oneOf('vue-modules') */
      {
        resourceQuery: /module/,
        use: [
          isDev
            ? {
                loader: 'vue-style-loader',
                options: {
                  sourceMap: isDev,
                  shadowMode: false,
                },
              }
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 2,
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: isDev,
                modifyVars: {},
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      /* config.module.rule('less').oneOf('vue') */
      {
        resourceQuery: /\?vue/,
        use: [
          isDev
            ? {
                loader: 'vue-style-loader',
                options: {
                  sourceMap: isDev,
                  shadowMode: false,
                },
              }
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: isDev,
                modifyVars: {},
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      /* config.module.rule('less').oneOf('normal-modules') */
      {
        test: /\.module\.\w+$/,
        use: [
          isDev
            ? {
                loader: 'vue-style-loader',
                options: {
                  sourceMap: isDev,
                  shadowMode: false,
                },
              }
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 2,
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: isDev,
                modifyVars: {},
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      /* config.module.rule('less').oneOf('normal') */
      {
        use: [
          isDev
            ? {
                loader: 'vue-style-loader',
                options: {
                  sourceMap: isDev,
                  shadowMode: false,
                },
              }
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: isDev,
                modifyVars: {},
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  };
};
