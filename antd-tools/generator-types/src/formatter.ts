import type { Articals } from './parser';
import { formatType, removeVersion, toKebabCase } from './utils';
import type { VueTag } from './type';

function getComponentName(name: string, tagPrefix: string) {
  if (name) {
    return tagPrefix + toKebabCase(name.split(' ')[0]);
  }
  return '';
}

function parserProps(tag: VueTag, line: any) {
  const [name, desc, type, defaultVal] = line;
  if (
    type &&
    (type.includes('v-slot') ||
      type.includes('slot') ||
      type.includes('slots') ||
      type.includes('slot-scoped'))
  ) {
    tag.slots!.push({
      name: removeVersion(name),
      description: desc,
    });
  }
  tag.attributes!.push({
    name: removeVersion(name),
    default: defaultVal,
    description: desc,
    value: {
      type: formatType(type || ''),
      kind: 'expression',
    },
  });
}

export function formatter(
  articals: Articals,
  componentName: string,
  kebabComponentName: string,
  tagPrefix = '',
) {
  if (!articals.length) {
    return;
  }

  const tags: VueTag[] = [];
  const tag: VueTag = {
    name: kebabComponentName,
    slots: [],
    events: [],
    attributes: [],
  };
  tags.push(tag);

  const tables = articals.filter(artical => artical.type === 'table');

  tables.forEach(item => {
    const { table } = item;
    const prevIndex = articals.indexOf(item) - 1;
    const prevArtical = articals[prevIndex];

    if (!prevArtical || !prevArtical.content || !table || !table.body) {
      return;
    }

    const tableTitle = prevArtical.content;

    if (tableTitle.includes('API')) {
      table.body.forEach(line => {
        parserProps(tag, line);
      });
      return;
    }

    if (tableTitle.includes('events') && !tableTitle.includes(componentName)) {
      table.body.forEach(line => {
        const [name, desc] = line;
        tag.events!.push({
          name: removeVersion(name),
          description: desc,
        });
      });
      return;
    }

    // 额外的子组件
    if (
      tableTitle.includes(componentName) &&
      !tableTitle.includes('events') &&
      !tableTitle.includes('()')
    ) {
      const childTag: VueTag = {
        name: getComponentName(tableTitle.replace(/\.|\//g, ''), tagPrefix),
        slots: [],
        events: [],
        attributes: [],
      };
      table.body.forEach(line => {
        parserProps(childTag, line);
      });
      tags.push(childTag);
      return;
    }

    // 额外的子组件事件
    if (tableTitle.includes(componentName) && tableTitle.includes('events')) {
      const childTagName = getComponentName(
        tableTitle.replace('.', '').replace('events', ''),
        tagPrefix,
      );
      const childTag: VueTag | undefined = tags.find(item => item.name === childTagName.trim());
      if (!childTag) {
        return;
      }
      table.body.forEach(line => {
        const [name, desc] = line;
        childTag.events!.push({
          name: removeVersion(name),
          description: desc,
        });
      });
      return;
    }
  });

  return tags;
}
