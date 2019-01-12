import { mount } from '@vue/test-utils';
import Form from '..';

describe('Form', () => {
  it('should display two message', () => {
    const rules = [
      {
        pattern: /^\w+$/,
        message: 'Error message 1',
      },
      {
        pattern: /^\w+$/,
        message: 'Error message 2',
      },
    ];
    let myForm;
    const Form1 = Form.create()({
      render() {
        return (
          <Form>
            <Form.Item label="Account">
              {this.form.getFieldDecorator('account', { initialValue: '+=-/', rules })(<input />)}
            </Form.Item>
          </Form>
        );
      },
    });

    const wrapper = mount(Form1, {
      propsData: {
        wrappedComponentRef: inst => {
          myForm = inst.form;
        },
      },
    });
    myForm.validateFields();

    wrapper.vm.$forceUpdate();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should display custom message', () => {
    let myForm;
    const Form1 = Form.create()({
      created() {
        myForm = this.form;
      },
      render() {
        const rules = [
          {
            pattern: /^$/,
            message: (
              <span>
                Account does not exist,{' '}
                <a rel="noopener noreferrer" href="https://www.alipay.com/" target="_blank">
                  Forgot account?
                </a>
              </span>
            ),
          },
        ];
        return (
          <Form>
            <Form.Item label="Account">
              {this.form.getFieldDecorator('account', { initialValue: 'antd', rules })(<input />)}
            </Form.Item>
          </Form>
        );
      },
    });

    const wrapper = mount(Form1);
    myForm.validateFields();

    wrapper.vm.$forceUpdate();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
