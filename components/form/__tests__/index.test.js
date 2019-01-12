import { mount } from '@vue/test-utils';
import Form from '..';

describe('Form', () => {
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
