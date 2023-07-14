/* eslint-disable no-console */
import { defineComponent, ref, toRaw, reactive } from 'vue';
import { Form, FormItem, Input, Button, Checkbox } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => {
      const onFinish = () => {};
      const onFinishFailed = () => {};
      const formRef = ref();
      const formData = reactive({
        username: '',
        password: '',
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(() => {
            console.log('values', formData, toRaw(formData));
          })
          .catch(error => {
            console.log('error', error);
          });
      };
      const resetForm = () => {
        formRef.value.resetFields();
      };

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
            <Input v-model={[formData.username, 'value']} />
          </FormItem>
          <FormItem
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password v-model={[formData.password, 'value']} />
          </FormItem>
          <FormItem name="remember" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </FormItem>
          <FormItem wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" onClick={onSubmit}>
              Submit
            </Button>
            <Button style={{ marginLeft: '16px' }} onClick={resetForm}>
              Reset
            </Button>
          </FormItem>
        </Form>
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError', 'controlOutline', 'colorErrorBorder', 'colorErrorHover'],
  key: 'default',
};

export default componentDemo;
