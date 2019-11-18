import { TreeNode } from '../../vc-tree';
/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */
export default {
  name: 'SelectNode',
  functional: true,
  isTreeNode: true,
  props: TreeNode.props,
  render(h, context) {
    const { props, slots, listeners, data, scopedSlots } = context;
    const $slots = slots() || {};
    const children = $slots.default;
    const slotsKey = Object.keys($slots);
    const scopedSlotsTemp = {}; // for vue 2.5.x
    slotsKey.forEach(name => {
      scopedSlotsTemp[name] = () => $slots[name];
    });
    const treeNodeProps = {
      ...data,
      on: { ...listeners, ...data.nativeOn },
      props,
      scopedSlots: {
        ...scopedSlotsTemp,
        ...scopedSlots,
      },
    };
    return <TreeNode {...treeNodeProps}>{children}</TreeNode>;
  },
};
