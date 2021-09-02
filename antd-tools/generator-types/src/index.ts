import glob from 'fast-glob';
import { join, dirname } from 'path';
import { mdParser } from './parser';
import { formatter } from './formatter';
import { genWebTypes } from './web-types';
import { readFileSync, outputFileSync } from 'fs-extra';
import type { Options, VueTag } from './type';
import { normalizePath, getComponentName } from './utils';
import { genVeturTags, genVeturAttributes } from './vetur';

async function readMarkdown(options: Options) {
  // const mds = await glob(normalizePath(`${options.path}/**/*.md`))
  const mds = await glob(normalizePath(`${options.path}/**/*.md`));
  return mds
    .filter(md => options.test.test(md))
    .map(path => {
      const docPath = dirname(path);
      const componentName = docPath.substring(docPath.lastIndexOf('/') + 1);
      return {
        componentName: getComponentName(componentName || ''),
        md: readFileSync(path, 'utf-8'),
      };
    });
}

export async function parseAndWrite(options: Options) {
  if (!options.outputDir) {
    throw new Error('outputDir can not be empty.');
  }

  const docs = await readMarkdown(options);
  const datas = docs
    .map(doc => formatter(mdParser(doc.md), doc.componentName, options.tagPrefix))
    .filter(item => item) as VueTag[][];
  const tags: VueTag[] = [];
  datas.forEach(arr => {
    tags.push(...arr);
  });

  const webTypes = genWebTypes(tags, options);
  const veturTags = genVeturTags(tags);
  const veturAttributes = genVeturAttributes(tags);

  outputFileSync(join(options.outputDir, 'tags.json'), JSON.stringify(veturTags, null, 2));
  outputFileSync(
    join(options.outputDir, 'attributes.json'),
    JSON.stringify(veturAttributes, null, 2),
  );
  outputFileSync(join(options.outputDir, 'web-types.json'), JSON.stringify(webTypes, null, 2));
}

export default { parseAndWrite };
