import { defineComponent } from 'vue';
import { Form, Input } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

function onFinish() {}

const Demo = defineComponent({
  setup() {
    return () => (
      <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={onFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input status={'error'} />
        </Form.Item>
      </Form>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError', 'colorErrorBorder', 'colorErrorHover'],
  key: 'danger',
};

export default componentDemo;
