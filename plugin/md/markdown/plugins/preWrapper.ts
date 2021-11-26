// markdown-it plugin for wrapping <pre> ... </pre>.
//
// If your plugin was chained before preWrapper, you can add additional element directly.
// If your plugin was chained after preWrapper, you can use these slots:
//   1. <!--beforebegin-->
//   2. <!--afterbegin-->
//   3. <!--beforeend-->
//   4. <!--afterend-->

import type MarkdownIt from 'markdown-it';
import type { MarkdownParsedData } from '../markdown';

export const preWrapperPlugin = (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];
    const data = (md as any).__data as MarkdownParsedData;
    if (token.info?.trim() === 'vue') {
      data.vueCode = token.content;
    }
    const rawCode = fence(...args).replace(
      /<pre /g,
      `<pre class="language-${token.info?.trim()}" `,
    );
    return rawCode; //`<div class="language-${token.info.trim()}">${rawCode}</div>`;
  };
};
