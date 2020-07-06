import { filterEmpty } from './props-util';
import { cloneVNode } from 'vue';

export function cloneElement(vnode, nodeProps = {}, override = true) {
  let ele = vnode;
  if (Array.isArray(vnode)) {
    ele = filterEmpty(vnode)[0];
  }
  if (!ele) {
    return null;
  }
  const node = cloneVNode(ele, nodeProps);

  // cloneVNode内部是合并属性，这里改成覆盖属性
  node.props = override ? { ...node.props, ...nodeProps } : node.props;
  return node;
}

export function cloneVNodes(vnodes, nodeProps = {}, override = true) {
  return vnodes.map(vnode => cloneElement(vnode, nodeProps, override));
}
