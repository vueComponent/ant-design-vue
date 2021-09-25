<template>
  <div>
    <demo-box :jsfiddle="jsfiddle">
      <template #component>
        <slot />
      </template>
      <template #description>
        <div class="demo-description" v-html="cnHtml" />
      </template>
      <template #us-description>
        <div class="demo-description" v-html="usHtml" />
      </template>
      <template #code>
        {{ codeStr }}
      </template>
    </demo-box>
  </div>
</template>

<script>
import marked from 'marked';
import Prism from 'prismjs';
// import 'prismjs/components/prism-jsx.min.js';
// import 'prismjs/components/prism-bash.min.js';
const replaceDelimiters = function (str) {
  return str.replace(/({{|}})/g, '<span>$1</span>');
};
const renderHighlight = function (str, lang) {
  if (!(lang && Prism.languages[lang])) {
    return '';
  }

  try {
    return replaceDelimiters(Prism.highlight(str, Prism.languages[lang], lang));
  } catch (err) {}
};
const renderer = new marked.Renderer();
renderer.heading = function (text, level) {
  return (
    '<h' + level + ' id="' + text.replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>\n'
  );
};
marked.setOptions({
  renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: true,
  html: true,
  highlight: renderHighlight,
});
const cnReg = /<cn>([\S\s\t]*?)<\/cn>/;
const usReg = /<us>([\S\s\t]*?)<\/us>/;
export default {
  name: 'DemoContainer',
  props: ['code'],
  data() {
    const cn = this.code.match(cnReg) || [];
    const us = this.code.match(usReg) || [];
    const cnHtml = marked(cn[1].trim());
    const usHtml = marked(us[1].trim());
    const sourceCode = this.code.replace(cn[0], '').replace(us[0], '').trim();
    const codeHtml = marked('```html\n' + sourceCode + '```');
    return {
      codeStr: window.btoa(unescape(encodeURIComponent(codeHtml))),
      cnHtml,
      usHtml,
      jsfiddle: {
        sourceCode: window.btoa(unescape(encodeURIComponent(sourceCode))),
        cn: cn[1].trim(),
        us: us[1].trim(),
      },
    };
  },
};
</script>
