import { filterEmpty } from './props-util';
import type { VNode, VNodeProps } from 'vue';
import { cloneVNode } from 'vue';
import warning from './warning';
import type { RefObject } from './createRef';

export function cloneElement<T, U>(
  vnode: VNode<T, U> | VNode<T, U>[],
  nodeProps: Record<string, any> &
    Omit<VNodeProps, 'ref'> & { ref?: VNodeProps['ref'] | RefObject } = {},
  override = true,
  mergeRef = false,
): VNode<T, U> {
  let ele = vnode;
  if (Array.isArray(vnode)) {
    ele = filterEmpty(vnode)[0];
  }
  if (!ele) {
    return null;
  }
  const node = cloneVNode(ele as VNode<T, U>, nodeProps as any, mergeRef);

  // cloneVNode内部是合并属性，这里改成覆盖属性
  node.props = (override ? { ...node.props, ...nodeProps } : node.props) as any;
  warning(typeof node.props.class !== 'object', 'class must be string');
  return node;
}

export function cloneVNodes(vnodes, nodeProps = {}, override = true) {
  return vnodes.map(vnode => cloneElement(vnode, nodeProps, override));
}
