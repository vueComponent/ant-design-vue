import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Input from '..';
import Form from '../../form';
import focusTest from '../../../tests/shared/focusTest';

const { TextArea, Password } = Input;

describe('Input', () => {
  focusTest(Input);
  focusTest(TextArea);
  focusTest(Password);

  it('should support maxLength', async () => {
    const wrapper = mount(Input, { attrs: { maxLength: 3 }, sync: false });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    }, 0);
  });
  it('select()', () => {
    const wrapper = mount(Input);
    wrapper.vm.select();
  });

  it('should not support allowClear when it is disabled', () => {
    const wrapper = mount(Input, {
      propsData: { allowClear: true, defaultValue: '111', disabled: true },
      sync: false,
    });
    expect(wrapper.findAll('.ant-input-clear-icon').length).toBe(0);
  });
});

focusTest(TextArea);

describe('TextArea', () => {
  it('should auto calculate height according to content length', async () => {
    const wrapper = mount(TextArea, {
      propsData: { value: '', readOnly: true, autosize: true },
      sync: false,
    });

    const mockFunc = jest.spyOn(wrapper.vm, 'resizeTextarea');
    await asyncExpect(() => {
      wrapper.setProps({ value: '1111\n2222\n3333' });
    });
    await asyncExpect(() => {
      expect(mockFunc).toHaveBeenCalledTimes(1);
    });
    await asyncExpect(() => {
      wrapper.setProps({ value: '1111' });
    });

    await asyncExpect(() => {
      expect(mockFunc).toHaveBeenCalledTimes(2);
    }, 100);
  });

  it('should support disabled', async () => {
    const wrapper = mount(TextArea, { propsData: { disabled: true }, sync: false });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('should support maxLength', async () => {
    const wrapper = mount(TextArea, { attrs: { maxLength: 10 }, sync: false });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});

describe('As Form Control', () => {
  it('should be reset when wrapped in form.getFieldDecorator without initialValue', async () => {
    const Demo = {
      methods: {
        reset() {
          this.form.resetFields();
        },
      },

      render() {
        const { getFieldDecorator } = this.form;
        return (
          <Form>
            <Form.Item>{getFieldDecorator('input')(<Input />)}</Form.Item>
            <Form.Item>{getFieldDecorator('textarea')(<Input.TextArea />)}</Form.Item>
            <button type="button" onClick={this.reset}>
              reset
            </button>
          </Form>
        );
      },
    };
    const DemoForm = Form.create()(Demo);
    const wrapper = mount(DemoForm, { sync: false });
    await asyncExpect(() => {
      wrapper.find('input').element.value = '111';
      wrapper.find('input').trigger('input');
      wrapper.find('textarea').element.value = '222';
      wrapper.find('textarea').trigger('input');
    });
    await asyncExpect(() => {
      expect(wrapper.find('input').element.value).toBe('111');
      expect(wrapper.find('textarea').element.value).toBe('222');
      wrapper.find('button').trigger('click');
    });
    await asyncExpect(() => {
      expect(wrapper.find('input').element.value).toBe('');
      expect(wrapper.find('textarea').element.value).toBe('');
    });
  });
});

describe('Input.Search', () => {
  it('should support suffix', async () => {
    const wrapper = mount(Input.Search, { propsData: { suffix: 'suffix' }, sync: false });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
