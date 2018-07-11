import { TreeNode } from '../../vc-tree'
export default {
  name: 'TreeNode',
  __ANT_TREE_SELECT_NODE: true,
  props: {
    ...TreeNode.props,
    value: String,
  },
  render () {
    return this
  },
}
