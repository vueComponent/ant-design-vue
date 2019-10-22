<script>
/* eslint no-console:0 */
import Tree, { TreeNode } from '../index';
import '../assets/index.less';
import './contextmenu.less';

export default {
  data() {
    return {
      selectedKeys: ['0-1', '0-1-1'],
    };
  },
  methods: {
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys;
    },
    onRightClick(info) {
      console.log('right click', info);
      this.selectedKeys = [info.node.eventKey];
    },
    onMouseEnter(info) {
      console.log('enter', info);
    },
    onMouseLeave(info) {
      console.log('leave', info);
    },
  },

  render() {
    return (
      <div>
        <h2>right click contextmenu</h2>
        <Tree
          onRightClick={this.onRightClick}
          onSelect={this.onSelect}
          selectedKeys={this.selectedKeys}
          multiple
          defaultExpandAll
          showLine
          showIcon={false}
        >
          <TreeNode title="parent 1" key="0-1">
            <TreeNode title="parent 1-0" key="0-1-1">
              <TreeNode title="leaf0" isLeaf />
              <TreeNode title="leaf1" isLeaf />
              <TreeNode title="leaf2" isLeaf />
            </TreeNode>
            <TreeNode title="parent 1-1">
              <TreeNode title="leaf" isLeaf />
            </TreeNode>
          </TreeNode>
        </Tree>
        <h2>hover popup contextmenu</h2>
        <Tree
          onMouseenter={this.onMouseEnter}
          onMouseleave={this.onMouseLeave}
          onSelect={this.onSelect}
          multiple
          defaultExpandAll
          showLine
        >
          <TreeNode title="parent 1" key="0-1">
            <TreeNode title="parent 1-0" key="0-1-1">
              <TreeNode title="leaf" isLeaf />
              <TreeNode title="leaf" />
            </TreeNode>
            <TreeNode title="parent 1-1">
              <TreeNode title="leaf" />
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    );
  },
};
</script>
