import { defineComponent, ref } from 'vue';
import { TreeSelect } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { TreeNode } = TreeSelect;

const Demo = defineComponent({
  setup() {
    const value = ref(undefined);
    const onChange = () => {
      value.value = value.value;
    };
    return () => {
      return (
        <TreeSelect
          showSearch
          style={{ width: '100%' }}
          value={value.value}
          dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
          placeholder="Please select"
          allowClear
          treeDefaultExpandAll
          onChange={onChange}
        >
          <TreeNode value="parent 1" title="parent 1">
            <TreeNode value="parent 1-0" title="parent 1-0">
              <TreeNode value="leaf1" title="leaf1" />
              <TreeNode value="leaf2" title="leaf2" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1">
              <TreeNode value="leaf3" title={'leaf3'} />
            </TreeNode>
          </TreeNode>
        </TreeSelect>
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [
    'colorPrimary',
    'colorPrimaryActive',
    'controlOutline',
    'colorBgElevated',
    'colorBgContainer',
  ],
  key: 'default',
};

export default componentDemo;
