// import cheerio from 'cheerio';
const scriptRE = /<script[^>]*>([\s\S]*)<\/script>/;
const scriptContentRE = /(?<=<script[^>]*>)([\s\S]*)(?=<\/script>)/;
const templateRE = /<template[^>]*>([\s\S]*)<\/template>/;
const styleRE = /<style[^>]*>([\s\S]*)<\/style>/;
const docsRE = /(?<=<docs>)([\s\S]*)(?=<\/docs>)/;
const reObj = {
  script: scriptRE,
  style: styleRE,
  docs: docsRE,
  template: templateRE,
  scriptContent: scriptContentRE,
};

export default function fetchCode(src: string, type: string): string {
  if (type === 'template') {
    //     const $ = cheerio.load(src, {
    //       decodeEntities: false,
    //       xmlMode: false,
    //       recognizeSelfClosing: true,
    //       _useHtmlParser2: true,
    //     });
    //     return `<template>
    //   ${$(type).html().trim()}
    // </template>`;
    src = src.split('<script')[0];
  }
  const matches = src.match(reObj[type]);
  return matches ? matches[0] : '';
}
