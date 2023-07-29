import { defineComponent } from 'vue';
import { Card, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space>
        <Card type="inner" title="Inner Card title">
          Inner Card content
        </Card>
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorFillAlter'],
  key: 'inner',
};

export default componentDemo;
