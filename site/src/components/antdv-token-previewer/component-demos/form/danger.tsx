import { defineComponent, ref, reactive } from 'vue';
import { Form, FormItem, Input } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => {
      const onFinish = () => {};
      const onFinishFailed = () => {};
      const formRef = ref();
      const formData = reactive({
        username: '',
      });

      return (
        <Form
          ref={formRef}
          model={formData}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <FormItem
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input status={'error'} v-model={[formData.username, 'value']} />
          </FormItem>
        </Form>
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError', 'colorErrorBorder', 'colorErrorHover'],
  key: 'danger',
};

export default componentDemo;
