import { defineComponent } from 'vue';
import { Alert, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space direction={'vertical'}>
        <Alert message="Success Tips" type="success" showIcon />
        <Alert message="Informational Notes" type="info" showIcon />
        <Alert message="Warning" type="warning" showIcon closable />
        <Alert message="Error" type="error" showIcon />
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorIconHover', 'colorIcon', 'colorText'],
  key: 'alert',
};

export default componentDemo;
