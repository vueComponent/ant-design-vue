import { defineComponent } from 'vue';
import { Input } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

function onChange() {}

const Demo = defineComponent({
  setup() {
    return () => <Input status={'warning'} defaultValue={3} onChange={onChange} />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorWarning', 'colorWarningBorder', 'colorWarningHover', 'colorWarningOutline'],
  key: 'warning',
};

export default componentDemo;
