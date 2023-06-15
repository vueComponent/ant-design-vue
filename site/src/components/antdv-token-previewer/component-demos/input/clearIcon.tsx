import { defineComponent } from 'vue';
import { Input } from 'ant-design-vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => <Input placeholder="Basic usage" value={'右侧的图标就是 colorIcon'} allowClear />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorIcon', 'colorIconHover'],
  key: 'clearIcon',
};
export default componentDemo;
