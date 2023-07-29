import { defineComponent } from 'vue';
import { message, Button } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const error = () => {
      message.error('This is an error message');
    };

    return () => <Button onClick={error}>Error</Button>;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError'],
  key: 'error',
};

export default componentDemo;
