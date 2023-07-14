import { Modal, Button } from 'ant-design-vue';
import { defineComponent } from 'vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const success = () => {
      Modal.success({
        title: 'This is a success message',
        content: () => (
          <div>
            <p>some messages...some messages...</p>
            <p>some messages...some messages...</p>
          </div>
        ),
      });
    };

    return () => <Button onClick={success}>Success</Button>;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSuccess'],
  key: 'success',
};
export default componentDemo;
