/* eslint no-console:0, no-alert: 0 */

import BaseMixin from '../../_util/BaseMixin';
import '../assets/index.less';
import '../../vc-dialog/assets/index.less';
import TreeSelect, { TreeNode } from '../src/index';
import './demo.less';

export default {
  mixins: [BaseMixin],
  data: () => ({
    treeExpandedKeys: [],
  }),
  methods: {
    onTreeExpand(treeExpandedKeys) {
      this.setState({
        treeExpandedKeys,
      });
    },

    setTreeExpandedKeys() {
      this.setState({
        treeExpandedKeys: ['000', '0-1-0'],
      });
    },
  },

  render() {
    const { treeExpandedKeys } = this;

    return (
      <div>
        <h2>Conrolled treeExpandedKeys</h2>
        <TreeSelect
          style={{ width: '200px' }}
          dropdownStyle={{ maxHeight: '200px', overflow: 'auto' }}
          treeExpandedKeys={treeExpandedKeys}
          onTreeExpand={this.onTreeExpand}
          __propsSymbol__={Symbol()}
        >
          <TreeNode value="" title="parent 1" key="000">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-0">
              <TreeNode value="leaf1" title="my leaf" key="random" />
              <TreeNode value="leaf2" title="your leaf" key="random1" disabled />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="0-1-1">
              <TreeNode
                value="sss"
                title={<span style={{ color: 'red' }}>sss</span>}
                key="random3"
              />
              <TreeNode value="same value1" title="same txtle" key="0-1-1-1">
                <TreeNode
                  value="same value10"
                  title="same titlexd"
                  key="0-1-1-1-0"
                  style={{ color: 'red', background: 'green' }}
                />
              </TreeNode>
            </TreeNode>
          </TreeNode>
          <TreeNode value="same value2" title="same title" key="0-2">
            <TreeNode value="2same value" title="2same title" key="0-2-0" />
          </TreeNode>
          <TreeNode value="same value3" title="same title" key="0-3" />
        </TreeSelect>
        <button onClick={this.setTreeExpandedKeys}>Set treeExpandedKeys</button>
      </div>
    );
  },
};
