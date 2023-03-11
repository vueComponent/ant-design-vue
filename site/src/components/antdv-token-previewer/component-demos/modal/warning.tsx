import { Modal, Button } from 'ant-design-vue';
import { defineComponent } from 'vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const warning = () => {
      Modal.warning({
        title: 'This is a warning message',
        content: () => (
          <div>
            <p>some messages...some messages...</p>
            <p>some messages...some messages...</p>
          </div>
        ),
      });
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
