import { defineComponent, ref } from 'vue';
import { Transfer } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

import mockData from './data';

const initialTargetKeys = mockData.filter(item => +item.key > 10).map(item => item.key);

const Demo = defineComponent({
  setup() {
    const targetKeys = ref(initialTargetKeys);
    const selectedKeys = ref<string[]>([]);
    const onScroll = () => {};

    return () => {
      return (
        <Transfer
          dataSource={mockData}
          titles={['Source', 'Target']}
          targetKeys={targetKeys.value}
          status={'error'}
          selectedKeys={selectedKeys.value}
          onChange={nextTargetKeys => {
            targetKeys.value = nextTargetKeys;
          }}
          onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
            selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
          }}
          onScroll={onScroll}
          render={item => item.title}
        />
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError'],
  key: 'danger',
};

export default componentDemo;
