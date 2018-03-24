import { getOptionProps } from '../../_util/props-util'
import Tree from './Tree'
import TreeNode from './TreeNode'
Tree.TreeNode = TreeNode

//
const NewTree = {
  TreeNode: TreeNode,
  props: Tree.props,
  render () {
    const { $listeners, $slots } = this
    const treeProps = {
      props: {
        ...getOptionProps(this),
        children: $slots.default,
      },
      on: $listeners,
    }
    return (
      <Tree {...treeProps}>{$slots.default}</Tree>
    )
  },
}
export { TreeNode }
export default NewTree
