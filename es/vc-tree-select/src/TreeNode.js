import _extends from 'babel-runtime/helpers/extends';
import { TreeNode } from '../../vc-tree';
export default {
  name: 'TreeNode',
  __ANT_TREE_SELECT_NODE: true,
  props: _extends({}, TreeNode.props, {
    value: String
  }),
  render: function render() {
    return this;
  }
};