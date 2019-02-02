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
    const { props, slots, listeners, data } = context;
    const $slots = slots();
    const children = $slots.default;
    delete $slots.default;
    const treeNodeProps = {
      ...data,
      on: { ...listeners, ...data.nativeOn },
      props,
    };
    const slotsKey = Object.keys($slots);
    return (
      <TreeNode {...treeNodeProps}>
        {children}
        {slotsKey.length
          ? slotsKey.map(name => {
              return <template slot={name}>{$slots[name]}</template>;
            })
          : null}
      </TreeNode>
    );
  },
};
