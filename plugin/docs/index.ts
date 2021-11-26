import { createVueToMarkdownRenderFn } from './vueToMarkdown';
import type { MarkdownOptions } from '../md/markdown/markdown';
import type { Plugin } from 'vite';
import { createMarkdownToVueRenderFn } from '../md/markdownToVue';

interface Options {
  root?: string;
  markdown?: MarkdownOptions;
}

export default (options: Options = {}): Plugin => {
  const { root, markdown } = options;
  const vueToMarkdown = createVueToMarkdownRenderFn(root);
  const markdownToVue = createMarkdownToVueRenderFn(root, markdown);
  return {
    name: 'vueToMdToVue',
    async transform(code, id) {
      if (
        (id.endsWith('.vue') && id.indexOf('/demo/') > -1 && id.indexOf('index.vue') === -1) ||
        id.indexOf('/examples/App.vue') > -1
      ) {
        const res = vueToMarkdown(code, id);
        // transform .md files into vueSrc so plugin-vue can handle it
        return {
          code: res.ignore ? res.vueSrc : (await markdownToVue(res.vueSrc, id)).vueSrc,
          map: null,
        };
      }
    },
  };
};
