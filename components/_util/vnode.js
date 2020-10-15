import { filterEmpty } from './props-util';
import { cloneVNode } from 'vue';
import warning from './warning';

export function cloneElement(vnode, nodeProps = {}, override = true, mergeRef = false) {
  let ele = vnode;
  if (Array.isArray(vnode)) {
    ele = filterEmpty(vnode)[0];
  }
  if (!ele) {
    return null;
  }
  const node = cloneVNode(ele, nodeProps, mergeRef);

  // cloneVNode内部是合并属性，这里改成覆盖属性
  node.props = override ? { ...node.props, ...nodeProps } : node.props;
  warning(typeof node.props.class !== 'object', 'class must be string');
  return node;
}

export function cloneVNodes(vnodes, nodeProps = {}, override = true) {
  return vnodes.map(vnode => cloneElement(vnode, nodeProps, override));
}
