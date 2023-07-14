import { defineComponent } from 'vue';
import { Typography } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { Text } = Typography;

const Demo = defineComponent({
  setup() {
    return () => (
      <div>
        <Text type={'warning'}>Warning Title</Text>
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
