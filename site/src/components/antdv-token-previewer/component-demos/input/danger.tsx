import { defineComponent } from 'vue';
import { Input } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

function onChange() {}

const Demo = defineComponent({
  setup() {
    return () => <Input status={'error'} defaultValue={'hello'} onChange={onChange} />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError', 'colorErrorOutline', 'colorErrorBorder', 'colorErrorHover'],
  key: 'danger',
};

export default componentDemo;
