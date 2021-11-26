// Since VuePress needs to extract the header from the markdown source
// file and display it in the sidebar or title (#238), this file simply
// removes some unnecessary elements to make header displays well at
// sidebar or title.
//
// But header's parsing in the markdown content is done by the markdown
// loader based on markdown-it. markdown-it parser will will always keep
// HTML in headers, so in VuePress, after being parsed by the markdown
// loader, the raw HTML in headers will finally be parsed by Vue-loader.
// so that we can write HTML/Vue in the header. One exception is the HTML
// wrapped by <code>(markdown token: '`') tag.

const parseEmojis = (str: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const emojiData = require('markdown-it-emoji/lib/data/full.json');
  return String(str).replace(/:(.+?):/g, (placeholder, key) => emojiData[key] || placeholder);
};

const unescapeHtml = (html: string) =>
  String(html)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x3A;/g, ':')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const removeMarkdownTokens = (str: string) =>
  String(str)
    .replace(/(\[(.[^\]]+)\]\((.[^)]+)\))/g, '$2') // []()
    .replace(/(`|\*{1,3}|_)(.*?[^\\])\1/g, '$2') // `{t}` | *{t}* | **{t}** | ***{t}*** | _{t}_
    // eslint-disable-next-line no-useless-escape
    .replace(/(\\)(\*|_|`|\!|<|\$)/g, '$2'); // remove escape char '\'

const trim = (str = '') => str?.trim();

// This method remove the raw HTML but reserve the HTML wrapped by `<code>`.
// e.g.
// Input: "<a> b",   Output: "b"
// Input: "`<a>` b", Output: "`<a>` b"
export const removeNonCodeWrappedHTML = (str: string): string => {
  return String(str).replace(/(^|[^><`\\])<.*>([^><`]|$)/g, '$1$2');
};

const compose = (...processors: ((str: string) => string)[]) => {
  if (processors.length === 0) return (input: string) => input;
  if (processors.length === 1) return processors[0];
  return processors.reduce((prev, next) => {
    return str => next(prev(str));
  });
};

// Unescape html, parse emojis and remove some md tokens.
export const parseHeader = compose(unescapeHtml, parseEmojis, removeMarkdownTokens, trim);

// Also clean the html that isn't wrapped by code.
// Because we want to support using VUE components in headers.
// e.g. https://vuepress.vuejs.org/guide/using-vue.html#badge
export const deeplyParseHeader = compose(removeNonCodeWrappedHTML, parseHeader);
