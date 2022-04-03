import { flattenChildren, isValidElement } from '../../_util/props-util';
import type { VNode } from 'vue';
import type { BaseOptionType, DefaultOptionType } from '../Select';
import type { VueNode } from '../../_util/type';

function convertNodeToOption<OptionType extends BaseOptionType = DefaultOptionType>(
  node: VNode,
): OptionType {
  const {
    key,
    children,
    props: { value, disabled, ...restProps },
  } = node as Omit<VNode, 'key'> & {
    children: { default?: () => any };
    key: string | number;
  };
  const child = children?.default;
  return {
    key,
    value: value !== undefined ? value : key,
    children: child,
    disabled: disabled || disabled === '', // support <a-select-option disabled />
    ...(restProps as any),
  };
}

export function convertChildrenToData<OptionType extends BaseOptionType = DefaultOptionType>(
  nodes: VueNode[],
  optionOnly = false,
): OptionType[] {
  const dd = flattenChildren(nodes as [])
    .map((node: VNode, index: number): OptionType | null => {
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
        children: { default?: () => any; label?: () => any };
      };

      if (optionOnly || !isSelectOptGroup) {
        return convertNodeToOption(node);
      }
      const child = children && children.default ? children.default() : undefined;
      const label = props?.label || children.label?.() || key;
      return {
        key: `__RC_SELECT_GRP__${key === null ? index : String(key)}__`,
        ...props,
        label,
        options: convertChildrenToData(child || []),
      } as any;
    })
    .filter(data => data);
  return dd;
}
