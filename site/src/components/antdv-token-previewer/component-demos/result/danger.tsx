import { defineComponent } from 'vue';
import { Result } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => <Result status={'error'} title="Demo示意" subTitle="status 为 error" />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError'],
  key: 'danger',
};

export default componentDemo;
