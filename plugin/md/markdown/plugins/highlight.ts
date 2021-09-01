/* eslint-disable @typescript-eslint/no-var-requires */
const chalk = require('chalk');
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/index');
const escapeHtml = require('escape-html');

// required to make embedded highlighting work...
loadLanguages(['markup', 'css', 'javascript']);

function wrap(code: string, lang: string): string {
  if (lang === 'text') {
    code = escapeHtml(code);
  }
  return `<pre v-pre><code>${code}</code></pre>`;
}

export const highlight = (str: string, lang: string) => {
  if (!lang) {
    return wrap(str, 'text');
  }
  lang = lang.toLowerCase();
  const rawLang = lang;
  if (lang === 'vue' || lang === 'html') {
    lang = 'markup';
  }
  if (lang === 'md') {
    lang = 'markdown';
  }
  if (lang === 'ts') {
    lang = 'typescript';
  }
  if (lang === 'py') {
    lang = 'python';
  }
  if (!prism.languages[lang]) {
    try {
      loadLanguages([lang]);
    } catch (e) {
      console.warn(
        chalk.yellow(`[vitepress] Syntax highlight for language "${lang}" is not supported.`),
      );
    }
  }
  if (prism.languages[lang]) {
    const code = prism.highlight(str, prism.languages[lang], lang);
    return wrap(code, rawLang);
  }
  return wrap(str, 'text');
};
