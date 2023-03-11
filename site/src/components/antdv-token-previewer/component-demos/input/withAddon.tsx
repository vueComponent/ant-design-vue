import { defineComponent } from 'vue';
import { Input } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => <Input addonBefore="http://" addonAfter=".com" defaultValue="mysite" />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorFillAlter'],
  key: 'withAddon',
};

export default componentDemo;
