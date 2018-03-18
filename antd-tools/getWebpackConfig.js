const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const deepAssign = require('deep-assign')
const chalk = require('chalk')
const postcssConfig = require('./postcssConfig')
const distFileBaseName = 'antd'
module.exports = function (modules) {
  const pkg = require(path.join(process.cwd(), 'package.json'))
  const babelConfig = require('./getBabelCommonConfig')(modules || false)

  const pluginImportOptions = [
    {
      style: true,
      libraryName: 'antd',
      libraryDirectory: 'components',
    },
  ]

  // if (distFileBaseName !== 'antd') {
  //   pluginImportOptions.push({
  //     style: 'css',
  //     libraryDirectory: 'components',
  //     libraryName: 'antd',
  //   })
  // }

  babelConfig.plugins.push([
    require.resolve('babel-plugin-import'),
    pluginImportOptions,
  ])

  const config = {
    devtool: 'source-map',

    output: {
      path: path.join(process.cwd(), './dist/'),
      filename: '[name].js',
    },

    resolve: {
      modules: ['node_modules', path.join(__dirname, '../node_modules')],
      extensions: ['.js', '.vue', '.md', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': process.cwd(),
      },
    },

    node: [
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

    module: {
      noParse: [/moment.js/],
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelConfig,
            },
            {
              loader: 'vue-loader',
            },
          ],
        },
        {
          test: /\.js$/,
          loader: 'babel-loader', exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: Object.assign(
                  {},
                  postcssConfig,
                  { sourceMap: true }
                ),
              },
            ],
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: Object.assign(
                  {},
                  postcssConfig,
                  { sourceMap: true }
                ),
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
        },
      ],
    },

    plugins: [
      new ExtractTextPlugin({
        filename: '[name].css',
        disable: false,
        allChunks: true,
      }),
      new CaseSensitivePathsPlugin(),
      new webpack.BannerPlugin(`
${distFileBaseName} v${pkg.version}

Copyright 2017-present, tangjinzhou, Inc.
All rights reserved.
      `),
      new webpack.ProgressPlugin((percentage, msg, addInfo) => {
        const stream = process.stderr
        if (stream.isTTY && percentage < 0.71) {
          stream.cursorTo(0)
          stream.write(`📦  ${chalk.magenta(msg)} (${chalk.magenta(addInfo)})`)
          stream.clearLine(1)
        } else if (percentage === 1) {
          console.log(chalk.green('\nwebpack: bundle build is now finished.'))
        }
      }),
    ],
  }

  if (process.env.RUN_ENV === 'PRODUCTION') {
    const entry = ['./components/index']
    config.entry = {
      [`${distFileBaseName}.min`]: entry,
    }
    config.externals = {
      vue: {
        root: 'Vue',
        commonjs2: 'vue',
        commonjs: 'vue',
        amd: 'vue',
      },
    }
    config.output.library = distFileBaseName
    config.output.libraryTarget = 'umd'

    const uncompressedConfig = deepAssign({}, config)

    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        output: {
          ascii_only: true,
        },
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
    ])

    uncompressedConfig.entry = {
      [distFileBaseName]: entry,
    }

    uncompressedConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }))

    return [config, uncompressedConfig]
  }

  return config
}
