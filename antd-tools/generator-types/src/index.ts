import glob from 'fast-glob';
import { dirname, join } from 'path';
import { mdParser } from './parser';
import { formatter } from './formatter';
import { genWebTypes } from './web-types';
import { outputFileSync, readFileSync } from 'fs-extra';
import type { Options, VueTag } from './type';
import { getComponentName, normalizePath, toKebabCase } from './utils';
import { flatMap } from 'lodash';

async function readMarkdown(options: Options): Promise<Map<String, VueTag>> {
  const mdPaths = await glob(normalizePath(`${options.path}/**/*.md`));
  const data = mdPaths
    .filter(md => options.test.test(md))
    .map(path => {
      const docPath = dirname(path);
      const kebabComponentName =
        options.tagPrefix + docPath.substring(docPath.lastIndexOf('/') + 1) || '';
      const componentName = getComponentName(docPath.substring(docPath.lastIndexOf('/') + 1) || '');
      const fileContent = readFileSync(path, 'utf-8');
      return formatter(mdParser(fileContent), componentName, kebabComponentName, options.tagPrefix);
    })
    .filter(item => item) as VueTag[][];
  const tags = new Map<String, VueTag>();
  flatMap(data, item => item).forEach(mergedTag => mergeTag(tags, mergedTag));
  return tags;
}

function readTypings(options: Options): Map<String, VueTag> {
  const tags = new Map<String, VueTag>();
  const fileContent = readFileSync(options.typingsPath, 'utf-8');
  fileContent
    .split('\n')
    .filter(line => line && line.includes('typeof'))
    .map(line => {
      const l = line.trim();
      return toKebabCase(l.substring(0, l.indexOf(':')));
    })
    .forEach(tagName =>
      tags.set(tagName, {
        name: tagName,
        slots: [],
        events: [],
        attributes: [],
      }),
    );
  return tags;
}

function mergeTag(tags: Map<String, VueTag>, mergedTag: VueTag) {
  const tagName = mergedTag.name;
  const vueTag = tags.get(tagName);
  if (vueTag) {
    vueTag.slots = [...vueTag.slots, ...mergedTag.slots];
    vueTag.events = [...vueTag.events, ...mergedTag.events];
    vueTag.attributes = [...vueTag.attributes, ...mergedTag.attributes];
  } else {
    tags.set(tagName, mergedTag);
  }
}

function mergeTags(mergedTagsArr: Map<String, VueTag>[]): VueTag[] {
  if (mergedTagsArr.length === 1) return [...mergedTagsArr[0].values()];
  const tags = new Map<String, VueTag>();
  if (mergedTagsArr.length === 0) return [];
  mergedTagsArr.forEach(mergedTags => {
    mergedTags.forEach(mergedTag => mergeTag(tags, mergedTag));
  });
  return [...tags.values()];
}

export async function parseAndWrite(options: Options): Promise<Number> {
  if (!options.outputDir) {
    throw new Error('outputDir can not be empty.');
  }
  const tagsFromMarkdown = await readMarkdown(options);
  const tagsFromTypings = await readTypings(options);
  const tags = mergeTags([tagsFromMarkdown, tagsFromTypings]);
  const webTypes = genWebTypes(tags, options);
  outputFileSync(join(options.outputDir, 'web-types.json'), JSON.stringify(webTypes, null, 2));
  return tags.length;
}

export default { parseAndWrite };
