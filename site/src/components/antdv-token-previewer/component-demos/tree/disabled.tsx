import { Tree } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
          { title: 'leaf', key: '0-0-0-1' },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: <span style={{ color: '#1890ff' }}>sss</span>,
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];
const Demo = () => {
  return (
    <Tree
      disabled
      checkable
      expandedKeys={['0-0-0', '0-0-1']}
      selectedKeys={['0-0-0', '0-0-1']}
      checkedKeys={['0-0-0', '0-0-1']}
      treeData={treeData}
    />
  );
};

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorTextDisabled', 'colorBgContainerDisabled'],
  key: 'disabled',
};

export default componentDemo;
