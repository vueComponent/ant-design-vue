import { flattenChildren, isValidElement } from '../../_util/props-util';
import { VNode } from 'vue';
import { OptionData, OptionGroupData, OptionsType } from '../interface';

function convertNodeToOption(node: VNode): OptionData {
  const {
    key,
    children,
    props: { value, ...restProps },
  } = node as VNode & {
    children: { default?: () => any };
  };
  const child = children.default ? children.default() : undefined;
  return { key, value: value !== undefined ? value : key, children: child, ...restProps };
}

export function convertChildrenToData(nodes: any[], optionOnly = false): OptionsType {
  const dd = flattenChildren(nodes)
    .map((node: VNode, index: number): OptionData | OptionGroupData | null => {
      if (!isValidElement(node) || !node.type) {
        return null;
      }

      const {
        type: { isSelectOptGroup },
        key,
        children,
        props,
      } = node as VNode & {
        type: { isSelectOptGroup?: boolean };
        children: { default?: () => any };
      };

      if (optionOnly || !isSelectOptGroup) {
        return convertNodeToOption(node);
      }
      const child = children.default ? children.default() : undefined;
      return {
        key: `__RC_SELECT_GRP__${key === null ? index : key}__`,
        label: key,
        ...props,
        options: convertChildrenToData(child || []),
      } as any;
    })
    .filter(data => data);
  return dd;
}
