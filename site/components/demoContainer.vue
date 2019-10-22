<template>
  <div>
    <demo-box :jsfiddle="jsfiddle">
      <template slot="component">
        <slot />
      </template>
      <template slot="description">
        <div v-html="cnHtml" />
      </template>
      <template slot="us-description">
        <div v-html="usHtml" />
      </template>
      <template slot="code">
        <div v-html="codeHtml" />
      </template>
    </demo-box>
  </div>
</template>

<script>
import marked from 'marked';
const hljs = require('highlight.js');
const replaceDelimiters = function(str) {
  return str.replace(/({{|}})/g, '<span>$1</span>');
};
const renderHighlight = function(str, lang) {
  if (!(lang && hljs.getLanguage(lang))) {
    return '';
  }

  try {
    return replaceDelimiters(hljs.highlight(lang, str, true).value);
  } catch (err) {}
};
const renderer = new marked.Renderer();
renderer.heading = function(text, level) {
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
    const sourceCode = this.code
      .replace(cn[0], '')
      .replace(us[0], '')
      .trim();
    const codeHtml = marked('````html\n' + sourceCode + '````');
    return {
      codeHtml,
      cnHtml,
      usHtml,
      jsfiddle: {
        sourceCode,
        cn: cn[1].trim(),
        us: us[1].trim(),
      },
    };
  },
};
</script>
