const path = require('path');
const webpack = require('webpack');
const Prism = require('prismjs');
require('prismjs/components/prism-jsx.min.js');
require('prismjs/components/prism-bash.min.js');
require('prismjs/components/prism-json.min.js');
require('prismjs/components/prism-diff.min.js');
require('prismjs/components/prism-less.min.js');
const Token = require('markdown-it/lib/token');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const cheerio = require('cheerio');
const WebpackBar = require('webpackbar');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const getBabelCommonConfig = require('./getBabelCommonConfig');
const babelConfig = getBabelCommonConfig(false);

babelConfig.plugins.push(require.resolve('babel-plugin-syntax-dynamic-import'));

const fetch = (str, tag, scoped) => {
  const $ = cheerio.load(str, {
    decodeEntities: false,
    xmlMode: true,
  });
  if (!tag) {
    return str;
  }
  if (tag === 'style') {
    return scoped
      ? $(`${tag}[scoped]`).html()
      : $(`${tag}`)
          .not(`${tag}[scoped]`)
          .html();
  }
  return $(tag).html();
};

/**
 * `{{ }}` => `<span>{{</span> <span>}}</span>`
 * @param  {string} str
 * @return {string}
 */
const replaceDelimiters = function(str) {
  return str.replace(/({{|}})/g, '<span>$1</span>');
};

/**
 * renderHighlight
 * @param  {string} str
 * @param  {string} lang
 */

const renderHighlight = function(str, lang) {
  if (!(lang && Prism.languages[lang])) {
    return '';
  }

  try {
    return replaceDelimiters(Prism.highlight(str, Prism.languages[lang], lang));
  } catch (err) {}
};

const md = require('markdown-it')('default', {
  html: true,
  breaks: true,
  highlight: renderHighlight,
}).use(require('markdown-it-anchor'), {
  level: 2,
  slugify: string =>
    string
      .trim()
      .split(' ')
      .join('-'),
  permalink: true,
  // renderPermalink: (slug, opts, state, permalink) => {},
  permalinkClass: 'anchor',
  permalinkSymbol: '#',
  permalinkBefore: false,
});
// md.renderer.rules.fence = wrap(md.renderer.rules.fence)
const cnReg = new RegExp('<(cn)(?:[^<]|<)+</\\1>', 'g');
const usReg = new RegExp('<(us)(?:[^<]|<)+</\\1>', 'g');
md.core.ruler.push('update_template', function replace({ tokens }) {
  let cn = '';
  let us = '';
  let template = '';
  let script = '';
  let style = '';
  let scopedStyle = '';
  let code = '';
  let sourceCode = '';
  tokens.forEach(token => {
    if (token.type === 'html_block') {
      if (token.content.match(cnReg)) {
        cn = fetch(token.content, 'cn');
        token.content = '';
      }
      if (token.content.match(usReg)) {
        us = fetch(token.content, 'us');
        token.content = '';
      }
    }
    if (token.type === 'fence' && token.info === 'vue' && token.markup === '```') {
      sourceCode = token.content;
      code = '```html\n' + token.content + '```';
      template = fetch(token.content, 'template');
      script = fetch(token.content, 'script');
      style = fetch(token.content, 'style');
      scopedStyle = fetch(token.content, 'style', true);
      token.content = '';
      token.type = 'html_block';
    }
  });
  if (template) {
    let jsfiddle = {
      us,
      cn,
      sourceCode: Buffer.from(sourceCode).toString('base64'),
    };
    jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle));
    const codeHtml = code ? md.render(code.replace(/@/g, '__at__')).replace(/__at__/g, '@') : '';
    const cnHtml = cn ? md.render(cn) : '';
    let newContent = `
      <template>
        <demo-box :jsfiddle="${jsfiddle}">
          <template slot="component">${template}</template>
          <template slot="description">${cnHtml}</template>
          <template slot="us-description">${us ? md.render(us) : ''}</template>
          <template slot="code">${Buffer.from(codeHtml).toString('base64')}</template>
        </demo-box>
      </template>`;
    newContent += script
      ? `
      <script>
      ${script || ''}
      </script>
      `
      : '';
    newContent += style ? `<style>${style || ''}</style>` : '';
    newContent += scopedStyle ? `<style scoped>${scopedStyle || ''}</style>` : '';
    const t = new Token('html_block', '', 0);
    t.content = newContent;
    tokens.push(t);
  }
});
const vueLoaderOptions = {
  loaders: {
    js: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins: ['transform-vue-jsx', 'transform-object-rest-spread'],
        },
      },
    ],
  },
};
module.exports = {
  mode: 'production',
  entry: {
    index: [`./site/${process.env.ENTRY_INDEX || 'index'}.js`],
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader',
            options: vueLoaderOptions,
          },
          {
            loader: 'vue-antd-md-loader',
            options: Object.assign(md, {
              wrapper: 'div',
              raw: true,
            }),
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderOptions,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: babelConfig,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve:
    process.env.NODE_ENV === 'development'
      ? {
          modules: ['node_modules', path.join(__dirname, '../node_modules')],
          extensions: ['.js', '.jsx', '.vue', '.md'],
          alias: {
            vue$: 'vue/dist/vue.esm.js',
            'ant-design-vue$': path.join(__dirname, '../../components/index.js'),
            'ant-design-vue/es': path.join(__dirname, '../../components'),
            'ant-design-vue/lib': path.join(__dirname, '../../components'),
          },
        }
      : {
          modules: ['node_modules'],
          extensions: ['.js', '.jsx', '.vue', '.md'],
          alias: {
            vue$: 'vue/dist/vue.esm.js',
          },
        },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new VueLoaderPlugin(),
    new WebpackBar(),
    new HardSourceWebpackPlugin(),
  ],
};
