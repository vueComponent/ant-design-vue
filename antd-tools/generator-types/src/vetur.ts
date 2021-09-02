import type { VueTag, VeturTags, VeturAttributes } from './type';

export function genVeturTags(tags: VueTag[]) {
  const veturTags: VeturTags = {};

  tags.forEach(tag => {
    veturTags[tag.name] = {
      attributes: tag.attributes ? tag.attributes.map(item => item.name) : [],
    };
  });

  return veturTags;
}

export function genVeturAttributes(tags: VueTag[]) {
  const veturAttributes: VeturAttributes = {};

  tags.forEach(tag => {
    if (tag.attributes) {
      tag.attributes.forEach(attr => {
        veturAttributes[`${tag.name}/${attr.name}`] = {
          type: attr.value.type,
          description: `${attr.description}, Default: ${attr.default}`,
        };
      });
    }
  });

  return veturAttributes;
}
