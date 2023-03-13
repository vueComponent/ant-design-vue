import { Typography } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

import { defineComponent } from 'vue';
const { Title, Text } = Typography;

const Demo = defineComponent({
  setup() {
    return () => (
      <div>
        <Title type={'warning'} level={4}>
          Error Title
        </Title>
        <Text type={'warning'}>error Text</Text>
      </div>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorWarning'],
  key: 'warning',
};

export default componentDemo;
