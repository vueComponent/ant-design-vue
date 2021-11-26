import type MarkdownIt from 'markdown-it';
import type { MarkdownParsedData } from '../markdown';

// hoist <script> and <style> tags out of the returned html
// so that they can be placed outside as SFC blocks.
export const hoistPlugin = (md: MarkdownIt) => {
  const RE = /^<(script|style)(?=(\s|>|$))/i;

  md.renderer.rules.html_block = (tokens, idx) => {
    const content = tokens[idx].content || '';
    const data = (md as any).__data as MarkdownParsedData;
    const hoistedTags = data.hoistedTags || (data.hoistedTags = []);
    if (RE.test(content.trim())) {
      hoistedTags.push(content);
      return '';
    } else {
      return content;
    }
  };
};
