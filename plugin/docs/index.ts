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
    transform(code, id) {
      if (id.endsWith('.vue') && id.indexOf('/demo/') > -1 && id.indexOf('index.vue') === -1) {
        // transform .md files into vueSrc so plugin-vue can handle it
        return { code: markdownToVue(vueToMarkdown(code, id).vueSrc, id).vueSrc, map: null };
      }
    },
  };
};
