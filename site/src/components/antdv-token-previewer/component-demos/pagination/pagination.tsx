import { defineComponent } from 'vue';
import { Pagination, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space direction={'vertical'}>
        <Pagination showQuickJumper defaultCurrent={2} total={500} />

        <Pagination simple />
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorPrimaryHover', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
