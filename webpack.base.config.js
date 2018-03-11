const path = require('path')
const hljs = require('highlight.js')
const Token = require('markdown-it/lib/token')
const cheerio = require('cheerio')

const fetch = (str, tag) => {
  const $ = cheerio.load(str, { decodeEntities: false, xmlMode: true })
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

const md = require('markdown-it')('default', {
  html: true,
  breaks: true,
  highlight: renderHighlight,
})
// md.renderer.rules.fence = wrap(md.renderer.rules.fence)
const cnReg = new RegExp('<(cn)(?:[^<]|<)+</\\1>', 'g')
const usReg = new RegExp('<(us)(?:[^<]|<)+</\\1>', 'g')
md.core.ruler.push('update_template', function replace ({ tokens }) {
  let cn = ''
  let us = ''
  let template = ''
  let script = ''
  let style = ''
  let code = ''
  tokens.forEach(token => {
    if (token.type === 'html_block') {
      if (token.content.match(cnReg)) {
        cn = fetch(token.content, 'cn')
        token.content = ''
      }
      if (token.content.match(usReg)) {
        us = fetch(token.content, 'us')
        token.content = ''
      }
    }
    if (token.type === 'fence' && token.info === 'html' && token.markup === '```') {
      code = '````html\n' + token.content + '````'
      template = fetch(token.content, 'template')
      script = fetch(token.content, 'script')
      style = fetch(token.content, 'style')
      token.content = ''
      token.type = 'html_block'
    }
  })
  if (template) {
    let jsfiddle = {
      html: template,
      script,
      style,
    }
    jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle))
    const codeHtml = code ? md.render(code) : ''
    const cnHtml = cn ? md.render(cn) : ''
    let newContent = `
      <template>
        <demo-box :jsfiddle="${jsfiddle}">
          <template slot="component">${template}</template>
          <template slot="description">${cnHtml}</template>
          <template slot="us-description">${us ? md.render(us) : ''}</template>
          <template slot="code">${codeHtml}</template>
        </demo-box>
      </template>`
    newContent += script ? `
      <script>
      ${script || ''}
      </script>
      ` : ''
    newContent += style ? `
      <style scoped>
      ${style || ''}
      </style>
      ` : ''
    const t = new Token('html_block', '', 0)
    t.content = newContent
    tokens.push(t)
  }
})

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
            loader: 'vue-antd-md-loader',
            options: Object.assign(md, { wrapper: 'div' }),
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
    extensions: ['.js', '.vue', '.md'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'antd': path.join(__dirname, 'components'),
      '@': path.join(__dirname, ''),
    },
  },
}
