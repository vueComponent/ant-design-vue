<script>
/* eslint no-console:0 */
import Tree, { TreeNode } from '../index';
import '../assets/index.less';
import { gData, getRadioSelectKeys } from './util';
import '../../vc-dialog/assets/index.less';
import Modal from '../../vc-dialog';
import BaseMixin from '../../_util/BaseMixin';

export default {
  mixins: [BaseMixin],
  data() {
    return {
      // expandedKeys: getFilterExpandedKeys(gData, ['0-0-0-key']),
      expandedKeys: ['0-0-0-key'],
      autoExpandParent: true,
      // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
      checkedKeys: ['0-0-0-key'],
      checkStrictlyKeys: { checked: ['0-0-1-key'], halfChecked: [] },
      selectedKeys: [],
      treeData: [],
      visible: false,
      multiple: true,
    };
  },
  methods: {
    onExpand(expandedKeys) {
      console.log('onExpand', arguments);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded chilren keys.
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    },
    onCheck(checkedKeys) {
      this.setState({
        checkedKeys,
      });
    },
    onCheckStrictly(checkedKeys /* extra*/) {
      console.log(arguments);
      // const { checkedNodesPositions } = extra;
      // const pps = filterParentPosition(checkedNodesPositions.map(i => i.pos));
      // console.log(checkedNodesPositions.filter(i => pps.indexOf(i.pos) > -1).map(i => i.node.key));
      const cks = {
        checked: checkedKeys.checked || checkedKeys,
        halfChecked: [`0-0-${parseInt(Math.random() * 3, 10)}-key`],
      };
      this.setState({
        // checkedKeys,
        checkStrictlyKeys: cks,
        // checkStrictlyKeys: checkedKeys,
      });
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', selectedKeys, info);
      this.setState({
        selectedKeys,
      });
    },
    onRbSelect(selectedKeys, info) {
      let _selectedKeys = selectedKeys;
      if (info.selected) {
        _selectedKeys = getRadioSelectKeys(gData, selectedKeys, info.node.eventKey);
      }
      this.setState({
        selectedKeys: _selectedKeys,
      });
    },
    onClose() {
      this.setState({
        visible: false,
      });
    },
    handleOk() {
      this.setState({
        visible: false,
      });
    },
    showModal() {
      this.setState({
        expandedKeys: ['0-0-0-key', '0-0-1-key'],
        checkedKeys: ['0-0-0-key'],
        visible: true,
      });
      // simulate Ajax
      setTimeout(() => {
        this.setState({
          treeData: [...gData],
        });
      }, 2000);
    },
    triggerChecked() {
      this.setState({
        checkedKeys: [`0-0-${parseInt(Math.random() * 3, 10)}-key`],
      });
    },
  },

  render() {
    const loop = data => {
      return data.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title} disableCheckbox={item.key === '0-0-0-key'}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={item.title} />;
      });
    };
    // console.log(getRadioSelectKeys(gData, this.selectedKeys));
    return (
      <div style={{ padding: '0 20px' }}>
        <h2>dialog</h2>
        <button class="btn btn-primary" onClick={this.showModal}>
          show dialog
        </button>
        <Modal title="TestDemo" visible={this.visible} onOk={this.handleOk} onClose={this.onClose}>
          {this.treeData.length ? (
            <Tree
              checkable
              class="dialog-tree"
              onExpand={this.onExpand}
              expandedKeys={this.expandedKeys}
              autoExpandParent={this.autoExpandParent}
              onCheck={this.onCheck}
              checkedKeys={this.checkedKeys}
            >
              {loop(this.treeData)}
            </Tree>
          ) : (
            'loading...'
          )}
        </Modal>

        <h2>controlled</h2>
        <Tree
          checkable
          onExpand={this.onExpand}
          expandedKeys={this.expandedKeys}
          autoExpandParent={this.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.checkedKeys}
          onSelect={this.onSelect}
          selectedKeys={this.selectedKeys}
        >
          {loop(gData)}
        </Tree>
        <button onClick={this.triggerChecked}>trigger checked</button>

        <h2>checkStrictly</h2>
        <Tree
          checkable
          multiple={this.multiple}
          defaultExpandAll
          onExpand={this.onExpand}
          expandedKeys={this.expandedKeys}
          onCheck={this.onCheckStrictly}
          checkedKeys={this.checkStrictlyKeys}
          checkStrictly
        >
          {loop(gData)}
        </Tree>

        <h2>radio's behavior select (in the same level)</h2>
        <Tree
          multiple
          defaultExpandAll
          onSelect={this.onRbSelect}
          selectedKeys={getRadioSelectKeys(gData, this.selectedKeys)}
        >
          {loop(gData)}
        </Tree>
      </div>
    );
  },
};
</script>
