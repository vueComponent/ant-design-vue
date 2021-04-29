const { resolve } = require('./utils/projectHelper');

module.exports = function(modules) {
  const plugins = [
    [
      resolve('@babel/plugin-transform-typescript'),
      {
        isTSX: true,
      },
    ],
    [resolve('@vue/babel-plugin-jsx'), { mergeProps: false }],
    resolve('@babel/plugin-proposal-optional-chaining'),
    resolve('@babel/plugin-transform-object-assign'),
    resolve('@babel/plugin-proposal-object-rest-spread'),
    resolve('@babel/plugin-proposal-export-default-from'),
    resolve('@babel/plugin-proposal-export-namespace-from'),
    resolve('@babel/plugin-proposal-class-properties'),
    resolve('@babel/plugin-syntax-dynamic-import'),
    // resolve('babel-plugin-inline-import-data-uri'),
    // resolve('@babel/plugin-transform-member-expression-literals'),
    // resolve('@babel/plugin-transform-property-literals'),
    // resolve('@babel/plugin-proposal-export-default-from'),
    // resolve('@babel/plugin-transform-object-assign'),
    // resolve('@babel/plugin-transform-template-literals'),
    // resolve('@babel/plugin-proposal-object-rest-spread'),
    // resolve('@babel/plugin-proposal-class-properties'),
  ];
  plugins.push([
    resolve('@babel/plugin-transform-runtime'),
    {
      helpers: false,
    },
  ]);
  return {
    presets: [
      [
        resolve('@babel/preset-env'),
        {
          modules,
          targets: {
            browsers: [
              'last 2 versions',
              'Firefox ESR',
              '> 1%',
              'ie >= 11',
              'iOS >= 8',
              'Android >= 4',
            ],
          },
        },
      ],
    ],
    plugins,
    env: {
      test: {
        plugins: [resolve('babel-plugin-istanbul')],
      },
    },
  };
};
