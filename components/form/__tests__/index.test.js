import { mount } from '@vue/test-utils';
import Form from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Form', () => {
  mountTest(Form);
  mountTest(Form.Item);

  it('Form.Item should support data-*、aria-* and custom attribute', () => {
    const wrapper = mount({
      render() {
        return (
          <Form>
            <Form.Item data-text="123" aria-hidden="true" cccc="bbbb">
              text
            </Form.Item>
          </Form>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('hideRequiredMark', () => {
    const wrapper = mount(Form, {
      propsData: {
        hideRequiredMark: true,
      },
    });
    expect(wrapper.classes()).toContain('ant-form-hide-required-mark');
  });

  describe('wrappedComponentRef', () => {
    it('get component ref', () => {
      const TestForm = {
        data() {
          return {
            __TESTFORM__: true,
          };
        },
        render() {
          return <Form />;
        },
      };
      const Wrapped = Form.create()(TestForm);
      let form;
      mount(Wrapped, {
        propsData: {
          wrappedComponentRef: node => {
            form = node;
          },
        },
      });
      expect(form._data.__TESTFORM__).toBe(true);
    });
  });
});
