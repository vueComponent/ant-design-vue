import type MarkdownIt from 'markdown-it';
import type { MarkdownParsedData } from '../markdown';
import { deeplyParseHeader } from '../../utils/parseHeader';
import { slugify } from './slugify';

export const extractHeaderPlugin = (md: MarkdownIt, include = ['h2', 'h3']) => {
  md.renderer.rules.heading_open = (tokens, i, options, _env, self) => {
    const token = tokens[i];
    if (include.includes(token.tag)) {
      const title = tokens[i + 1].content;
      const idAttr = token.attrs!.find(([name]) => name === 'id');
      const slug = idAttr && idAttr[1];
      const content = tokens[i + 4].content;
      const data = (md as any).__data as MarkdownParsedData;
      const headers = data.headers || (data.headers = []);
      headers.push({
        level: parseInt(token.tag.slice(1), 10),
        title: deeplyParseHeader(title),
        slug: slug || slugify(title),
        content,
      });
    }
    return self.renderToken(tokens, i, options);
  };
};
