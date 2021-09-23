/* eslint-disable @typescript-eslint/no-var-requires */
import MarkdownIt from 'markdown-it';
import { parseHeader } from '../utils/parseHeader';
import { highlight } from './plugins/highlight';
import { slugify } from './plugins/slugify';
import { highlightLinePlugin } from './plugins/highlightLines';
import { lineNumberPlugin } from './plugins/lineNumbers';
import { componentPlugin } from './plugins/component';
import { containerPlugin } from './plugins/containers';
import { snippetPlugin } from './plugins/snippet';
import { hoistPlugin } from './plugins/hoist';
import { preWrapperPlugin } from './plugins/preWrapper';
import { linkPlugin } from './plugins/link';
import { extractHeaderPlugin } from './plugins/header';
import type { Header } from '../../shared';

const emoji = require('markdown-it-emoji');
const anchor = require('markdown-it-anchor');
const toc = require('markdown-it-table-of-contents');

export interface MarkdownOptions extends MarkdownIt.Options {
  lineNumbers?: boolean;
  config?: (md: MarkdownIt) => void;
  anchor?: {
    permalink?: boolean;
    permalinkBefore?: boolean;
    permalinkSymbol?: string;
  };
  // https://github.com/Oktavilla/markdown-it-table-of-contents
  toc?: any;
  externalLinks?: Record<string, string>;
}

export interface MarkdownParsedData {
  hoistedTags?: string[];
  links?: string[];
  headers?: Header[];
  vueCode?: string;
}

export interface MarkdownRenderer {
  __data: MarkdownParsedData;
  render: (src: string, env?: any) => { html: string; data: any };
}

export const createMarkdownRenderer = (options: MarkdownOptions = {}): MarkdownRenderer => {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    highlight,
    ...options,
  });

  // custom plugins
  md.use(componentPlugin)
    .use(highlightLinePlugin)
    .use(preWrapperPlugin)
    .use(snippetPlugin)
    .use(hoistPlugin)
    .use(containerPlugin)
    .use(extractHeaderPlugin)
    .use(linkPlugin, {
      target: '_blank',
      rel: 'noopener noreferrer',
      ...options.externalLinks,
    })

    // 3rd party plugins
    .use(emoji)
    .use(anchor, {
      slugify,
      permalink: anchor.permalink.linkInsideHeader({
        symbol: `
          <span aria-hidden="true" class="anchor">#</span>
        `,
      }),
      permalinkBefore: true,
      permalinkSymbol: '#',
      permalinkAttrs: () => ({ 'aria-hidden': true }),
      tabIndex: false,
      ...options.anchor,
    })
    .use(toc, {
      slugify,
      includeLevel: [2, 3],
      format: parseHeader,
      ...options.toc,
    });

  // apply user config
  if (options.config) {
    options.config(md);
  }

  if (options.lineNumbers) {
    md.use(lineNumberPlugin);
  }

  // wrap render so that we can return both the html and extracted data.
  const render = md.render;
  const wrappedRender: MarkdownRenderer['render'] = src => {
    (md as any).__data = {};
    const html = render.call(md, src);
    return {
      html,
      data: (md as any).__data,
    };
  };
  (md as any).render = wrappedRender;

  return md as any;
};
