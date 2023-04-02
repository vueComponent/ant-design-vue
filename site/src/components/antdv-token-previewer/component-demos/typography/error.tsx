import { defineComponent } from 'vue';
import { Typography } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { Title, Text } = Typography;

const Demo = defineComponent({
  setup() {
    return () => (
      <div>
        <Title type={'danger'} level={4}>
          Error Title
        </Title>
        <Text type={'danger'}>error Text</Text>
      </div>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError', 'colorErrorHover', 'colorErrorActive'],
  key: 'error',
};

export default componentDemo;
