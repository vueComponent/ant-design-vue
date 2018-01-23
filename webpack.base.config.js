const path = require('path')
const slugify = require('transliteration').slugify
const hljs = require('highlight.js')

const cheerio = require('cheerio')

const fetch = (str, tag) => {
  const $ = cheerio.load(str, { decodeEntities: false })
  if (!tag) return str

  return $(tag).html()
}

/**
 * `{{ }}` => `<span>{{</span> <span>}}</span>`
 * @param  {string} str
 * @return {string}
 */
const replaceDelimiters = function (str) {
  return str.replace(/({{|}})/g, '<span>$1</span>')
}

/**
 * renderHighlight
 * @param  {string} str
 * @param  {string} lang
 */

const renderHighlight = function (str, lang) {
  if (!(lang && hljs.getLanguage(lang))) {
    return ''
  }

  try {
    return replaceDelimiters(hljs.highlight(lang, str, true).value)
  } catch (err) {}
}

function wrap (render) {
  return function () {
    return render.apply(this, arguments)
      .replace('<code class="', '<code class="hljs ')
      .replace('<code>', '<code class="hljs">')
      .replace('<pre>', '<pre class="code-section">')
  }
};

const md = require('markdown-it')('default', {
  html: true,
  breaks: true,
  highlight: renderHighlight,
})
md.use(require('markdown-it-anchor'), {
  level: 2,
  slugify: slugify,
  permalink: true,
  permalinkBefore: true,
}).use(require('markdown-it-container'), 'demo', {

  validate: function (params) {
    return params.trim().match(/^demo\s*(.*)$/)
  },
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
      const summaryContent = tokens[idx + 1].content
      const summary = fetch(summaryContent, 'summary')
      const summaryHTML = summary ? md.render(summary) : ''

      const content = tokens[idx + 2].content
      const html = fetch(content, 'template')
      const script = fetch(content, 'script') || ''
      const style = fetch(content, 'style') || ''
      const code = tokens[idx + 2].markup + tokens[idx + 2].info + '\n' + content + tokens[idx + 2].markup
      const codeHtml = code ? md.render(code) : ''

      let jsfiddle = { html: html, script: script, style: style }
      jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle))
      // opening tag
      return `<template>
                <demo-box :jsfiddle="${jsfiddle}">
                  <div class="box-demo-show" slot="component">${html}</div>
                  <template slot="description">${summaryHTML}</template>
                  <div class="highlight" slot="code">${codeHtml}</div>
                </demo-box>
              </template>
              <script>
              ${script}
              </script>
              <style>
              ${style}
              </style>
              `
    } else {
      return '\n'
    }
  },
})
md.renderer.rules.table_open = function () {
  return '<table class="table">'
}
md.renderer.rules.fence = wrap(md.renderer.rules.fence)

module.exports = {
  entry: {
    index: [
      './examples/index.js',
    ],
  },
  module: {
    rules: [
      {
        test: /\.md/,
        use: [
          {
            loader: 'vue-markdown-loader',
            options: Object.assign(md, { wrapper: 'section', preventExtract: true }),
          },
        ],
      },
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
