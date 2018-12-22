import { TreeNode } from '../../vc-tree'
/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */
export default {
  functional: true,
  name: 'SelectNode',
  isTreeNode: true,
  props: TreeNode.props,
  render (h, context) {
    const { props, slots, listeners, data } = context
    const children = slots().default
    const treeNodeProps = {
      ...data, on: { ...listeners, ...data.nativeOn }, props,
    }
    return <TreeNode {...treeNodeProps}>{children}</TreeNode>
  },
}
