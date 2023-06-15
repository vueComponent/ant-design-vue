import { defineComponent } from 'vue';
import { Progress, Space } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space direction={'vertical'} size={'large'}>
        <Space size={'large'}>
          <Progress percent={70} status="exception" type={'dashboard'} />
          <Progress percent={80} status="exception" type={'circle'} />
        </Space>
        <Progress percent={50} status="exception" />
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError'],
  key: 'danger',
};

export default componentDemo;
