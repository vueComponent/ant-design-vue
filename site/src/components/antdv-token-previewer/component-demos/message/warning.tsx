import { defineComponent } from 'vue';
import { message, Button } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const warning = () => {
      message.warning('This is an warning message');
    };

    return () => <Button onClick={warning}>Warning</Button>;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorWarning'],
  key: 'warning',
};

export default componentDemo;
