module.exports = {
  env: {
    test: {
      presets: [['@babel/preset-env']],
      plugins: [
        ['@vue/babel-plugin-jsx', { mergeProps: false, enableObjectSlots: false }],
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
        'transform-require-context',
      ],
    },
  },
};
