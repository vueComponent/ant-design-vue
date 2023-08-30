import { Modal, Button } from 'ant-design-vue';
import { defineComponent } from 'vue';

import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const info = () => {
      Modal.info({
        title: 'This is a info message',
        content: () => (
          <div>
            <p>some messages...some messages...</p>
            <p>some messages...some messages...</p>
          </div>
        ),
        onOk() {
          // eslint-disable-next-line no-console
          console.log('i am ok');
        },
      });
    };

    return () => <Button onClick={info}>info</Button>;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorInfo'],
  key: 'info',
};
export default componentDemo;
