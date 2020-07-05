import { filterEmpty } from './props-util';
import { cloneVNode } from 'vue';

export function cloneElement(n, nodeProps = {}, override = true) {
  let ele = n;
  if (Array.isArray(n)) {
    ele = filterEmpty(n)[0];
  }
  if (!ele) {
    return null;
  }
  const node = cloneVNode(ele, nodeProps);

  // cloneVNode内部是合并属性，这里改成覆盖属性
  node.props = override ? { ...node.props, ...nodeProps } : node.props;
  return node;
}

export function cloneVNodes(vnodes, deep) {
  const len = vnodes.length;
  const res = new Array(len);
  for (let i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res;
}
