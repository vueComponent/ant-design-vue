const { getProjectPath, resolve } = require('./utils/projectHelper');
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanUpStatsPlugin = require('./utils/CleanUpStatsPlugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const distFileBaseName = 'antd';

const svgRegex = /\.svg(\?v=\d+\.\d+\.\d+)?$/;
const svgOptions = {
  limit: 10000,
  minetype: 'image/svg+xml',
};

const imageOptions = {
  limit: 10000,
};

function getWebpackConfig(modules, esm = false) {
  const pkg = require(getProjectPath('package.json'));
  const babelConfig = require('./getBabelCommonConfig')(modules || false);

  const pluginImportOptions = {
    style: true,
    libraryName: distFileBaseName,
    libraryDirectory: 'components',
  };
  babelConfig.plugins.push([resolve('babel-plugin-import'), pluginImportOptions]);

  if (modules === false) {
    babelConfig.plugins.push(require.resolve('./replaceLib'));
  }

  /** @type {import('webpack').Configuration} */
  const config = {
    devtool: 'source-map',

    output: {
      path: getProjectPath('./dist/'),
      filename: '[name].js',
    },

    resolve: {
      modules: ['node_modules', path.join(__dirname, '../node_modules')],
      extensions: [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.vue',
        '.md',
        '.json',
      ],
      alias: {
        '@': process.cwd(),
      },
      fallback: [
        'child_process',
        'cluster',
        'dgram',
        'dns',
        'fs',
        'module',
        'net',
        'readline',
        'repl',
        'tls',
      ].reduce((acc, name) => Object.assign({}, acc, { [name]: 'empty' }), {}),
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                loaders: {
                  js: [
                    {
                      loader: 'babel-loader',
                      options: {
                        presets: [resolve('@babel/preset-env')],
                        plugins: [
                          [
                            resolve('@vue/babel-plugin-jsx'),
                            { mergeProps: false, enableObjectSlots: false },
                          ],
                          resolve('@babel/plugin-proposal-object-rest-spread'),
                        ],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: babelConfig,
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: babelConfig,
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['autoprefixer'],
                },
                sourceMap: true,
              },
            },
          ],
        },
        // Images
        {
          test: svgRegex,
          loader: 'url-loader',
          options: svgOptions,
        },
        {
          test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
          loader: 'url-loader',
          options: imageOptions,
        },
      ],
    },

    plugins: [
      // new BundleAnalyzerPlugin(),
      new CaseSensitivePathsPlugin(),
      new webpack.BannerPlugin(`
${pkg.name} v${pkg.version}

Copyright 2017-present, Ant Design Vue.
All rights reserved.
      `),
      new WebpackBar({
        name: '🚚  Ant Design Vue Tools',
        color: '#2f54eb',
      }),
      new CleanUpStatsPlugin(),
    ],
    performance: {
      hints: false,
    },
  };

  if (process.env.RUN_ENV === 'PRODUCTION') {
    let entry = ['./index'];
    config.externals = [
      {
        vue: {
          root: 'Vue',
          commonjs2: 'vue',
          commonjs: 'vue',
          amd: 'vue',
          module: 'vue',
        },
      },
    ];
    if (esm) {
      entry = ['./index.esm'];
      config.experiments = {
        ...config.experiments,
        outputModule: true,
      };
      config.output.chunkFormat = 'module';
      config.output.library = {
        type: 'module',
      };
      config.target = 'es2019';
    } else {
      config.output.libraryTarget = 'umd';
      config.output.library = distFileBaseName;
      config.output.globalObject = 'this';
    }

    const entryName = esm ? `${distFileBaseName}.esm` : distFileBaseName;

    config.optimization = {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            warnings: false,
          },
        }),
      ],
    };
    // Development
    const uncompressedConfig = merge({}, config, {
      entry: {
        [entryName]: entry,
      },
      mode: 'development',
      plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css',
        }),
      ],
    });

    // Production
    const prodConfig = merge({}, config, {
      entry: {
        [`${entryName}.min`]: entry,
      },
      mode: 'production',
      plugins: [
        new webpack.LoaderOptionsPlugin({
          minimize: true,
        }),
        new MiniCssExtractPlugin({
          filename: '[name].css',
        }),
      ],
      optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin({})],
      },
    });

    return [prodConfig, uncompressedConfig];
  }

  return [config];
}

getWebpackConfig.webpack = webpack;
getWebpackConfig.svgRegex = svgRegex;
getWebpackConfig.svgOptions = svgOptions;
getWebpackConfig.imageOptions = imageOptions;

module.exports = getWebpackConfig;
