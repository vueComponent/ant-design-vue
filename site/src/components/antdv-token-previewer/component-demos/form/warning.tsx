import { defineComponent } from 'vue';
import { Form, FormItem, Input } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

function onFinish() {}

const Demo = defineComponent({
  setup() {
    return () => (
      <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
        <FormItem
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input status={'warning'} />
        </FormItem>
      </Form>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorWarning'],
  key: 'warning',
};

export default componentDemo;
