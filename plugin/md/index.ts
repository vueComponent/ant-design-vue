import { createMarkdownToVueRenderFn } from './markdownToVue';
import type { MarkdownOptions } from './markdown/markdown';
import type { Plugin } from 'vite';

interface Options {
  root?: string;
  markdown?: MarkdownOptions;
}

export default (options: Options = {}): Plugin => {
  const { root, markdown } = options;
  const markdownToVue = createMarkdownToVueRenderFn(root, markdown);
  return {
    name: 'mdToVue',
    async transform(code, id) {
      if (id.endsWith('.md')) {
        // transform .md files into vueSrc so plugin-vue can handle it
        return { code: (await markdownToVue(code, id)).vueSrc, map: null };
      }
    },
  };
};
