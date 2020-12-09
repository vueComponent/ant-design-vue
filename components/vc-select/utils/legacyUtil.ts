import { flattenChildren, isValidElement } from '../../_util/props-util';
import { VNode, VNodeChild } from 'vue';
import { OptionData, OptionGroupData, OptionsType } from '../interface';

function convertNodeToOption(node: VNode): OptionData {
  const {
    key,
    children,
    props: { value, disabled, ...restProps },
  } = node as VNode & {
    children: { default?: () => any };
  };
  const child = children && children.default ? children.default() : undefined;
  return {
    key,
    value: value !== undefined ? value : key,
    children: child,
    disabled: disabled || disabled === '', // support <a-select-option disabled />
    ...restProps,
  };
}

export function convertChildrenToData(
  nodes: VNodeChild | JSX.Element,
  optionOnly = false,
): OptionsType {
  const dd = flattenChildren(nodes as [])
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
      const child = children && children.default ? children.default() : undefined;
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
