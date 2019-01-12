import { mount } from '@vue/test-utils';
import Tree from '../index';
import { calcRangeKeys } from '../util';

const TreeNode = Tree.TreeNode;

describe('Tree util', () => {
  it('calc range keys', () => {
    const wrapper = mount({
      render() {
        return (
          <Tree>
            <TreeNode key="0-0">
              <TreeNode key="0-0-0" />
              <TreeNode key="0-0-1" />
            </TreeNode>
            <TreeNode key="0-1">
              <TreeNode key="0-1-0" />
              <TreeNode key="0-1-1" />
            </TreeNode>
            <TreeNode key="0-2">
              <TreeNode key="0-2-0">
                <TreeNode key="0-2-0-0" />
                <TreeNode key="0-2-0-1" />
                <TreeNode key="0-2-0-2" />
              </TreeNode>
            </TreeNode>
          </Tree>
        );
      },
    });

    const treeWrapper = wrapper.find({ name: 'ATree' });
    const keys = calcRangeKeys(
      treeWrapper.vm.$slots.default,
      ['0-0', '0-2', '0-2-0'],
      '0-2-0-1',
      '0-0-0',
    );
    const target = ['0-0-0', '0-0-1', '0-1', '0-2', '0-2-0', '0-2-0-0', '0-2-0-1'];
    expect(keys.sort()).toEqual(target.sort());
  });
});
