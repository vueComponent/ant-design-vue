import path from 'path';
import LRUCache from 'lru-cache';
import slash from 'slash';
import fetchCode from '../md/utils/fetchCode';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('vitepress:md');
const cache = new LRUCache<string, MarkdownCompileResult>({ max: 1024 });

interface MarkdownCompileResult {
  vueSrc: string;
}

export function createVueToMarkdownRenderFn(root: string = process.cwd()): any {
  return (src: string, file: string): MarkdownCompileResult => {
    const relativePath = slash(path.relative(root, file));

    const cached = cache.get(src);
    if (cached) {
      debug(`[cache hit] ${relativePath}`);
      return cached;
    }

    const start = Date.now();
    const docs = fetchCode(src, 'docs')?.trim();
    const template = fetchCode(src, 'template');
    const script = fetchCode(src, 'script');
    const style = fetchCode(src, 'style');
    const newContent = `${docs}
\`\`\`vue
${template}
${script}
${style}
\`\`\`
`;
    debug(`[render] ${file} in ${Date.now() - start}ms.`);
    const result = {
      vueSrc: newContent?.trim(),
      ignore: !docs,
    };
    cache.set(src, result);
    return result;
  };
}
