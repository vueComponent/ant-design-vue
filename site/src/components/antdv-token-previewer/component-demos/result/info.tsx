import { defineComponent } from 'vue';
import { Result } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => <Result status={'info'} title="Demo示意" subTitle="status 为info" />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorInfo'],
  key: 'info',
};

export default componentDemo;
