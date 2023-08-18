import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Input from '..';
// import Form from '../../form';
import focusTest from '../../../tests/shared/focusTest';
import { WifiOutlined, SyncOutlined } from '@ant-design/icons-vue';

const { TextArea, Password } = Input;

describe('Input', () => {
  focusTest(Input);
  focusTest(TextArea);
  focusTest(Password);

  it('should support maxlength', async () => {
    const wrapper = mount(Input, { props: { maxlength: 3 }, sync: false });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    }, 0);
  });
  it('select()', async () => {
    const wrapper = mount(Input, { sync: false, attachTo: 'body' });
    await asyncExpect(() => {
      wrapper.vm.select();
    }, 0);
  });

  it('should not support allowClear when it is disabled', () => {
    const wrapper = mount(Input, {
      props: { allowClear: true, defaultValue: '111', disabled: true },
      sync: false,
    });
    expect(wrapper.findAll('.ant-input-clear-icon-hidden').length).toBeTruthy();
  });
});

describe('TextArea', () => {
  xit('should auto calculate height according to content length', async () => {
    const wrapper = mount(TextArea, {
      props: { value: '', readonly: true, autoSize: true },
      sync: false,
    });
    const mockFunc = jest.spyOn(wrapper.vm.resizableTextArea, 'resizeTextarea');
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
    const wrapper = mount(TextArea, { props: { disabled: true }, sync: false });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('should support maxlength', async () => {
    const wrapper = mount(TextArea, { attrs: { maxlength: 10 }, sync: false });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('should support showCount', async () => {
    const wrapper = mount(TextArea, {
      props: { showCount: true, defaultValue: '111', maxlength: 10 },
      sync: false,
    });
    expect(wrapper.find('.ant-input-textarea-show-count')).toBeTruthy();
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});

// describe('As Form Control', () => {
//   it('should be reset when wrapped in form.getFieldDecorator without initialValue', async () => {
//     const Demo = {
//       methods: {
//         reset() {
//           this.form.resetFields();
//         },
//       },

//       render() {
//         const { getFieldDecorator } = this.form;
//         return (
//           <Form>
//             <Form.Item>{getFieldDecorator('input')(<Input />)}</Form.Item>
//             <Form.Item>{getFieldDecorator('textarea')(<Input.TextArea />)}</Form.Item>
//             <button type="button" onClick={this.reset}>
//               reset
//             </button>
//           </Form>
//         );
//       },
//     };
//     const DemoForm = Form.create()(Demo);
//     const wrapper = mount(DemoForm, { sync: false });
//     await asyncExpect(() => {
//       wrapper.find('input').element.value = '111';
//       wrapper.find('input').trigger('input');
//       wrapper.find('textarea').element.value = '222';
//       wrapper.find('textarea').trigger('input');
//     });
//     await asyncExpect(() => {
//       expect(wrapper.find('input').element.value).toBe('111');
//       expect(wrapper.find('textarea').element.value).toBe('222');
//       wrapper.find('button').trigger('click');
//     });
//     await asyncExpect(() => {
//       expect(wrapper.find('input').element.value).toBe('');
//       expect(wrapper.find('textarea').element.value).toBe('');
//     });
//   });
// });

describe('Input.Search', () => {
  it('should support suffix', async () => {
    const wrapper = mount(Input.Search, { props: { suffix: 'suffix' }, sync: false });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    }, 100);
  });
});

describe('Input.Password', () => {
  it('should support iconRender', async () => {
    const wrapper = mount(Input.Password, {
      props: { iconRender: visible => (visible ? <SyncOutlined /> : <WifiOutlined />) },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-wifi').length).toBe(1);
      wrapper.find('.anticon-wifi').trigger('click');
    }, 100);
    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-sync').length).toBe(1);
    }, 100);
  });

  it('should support slot iconRender', async () => {
    const wrapper = mount(Input.Password, {
      slots: {
        iconRender: visible => (visible ? <SyncOutlined /> : <WifiOutlined />),
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-wifi').length).toBe(1);
      wrapper.find('.anticon-wifi').trigger('click');
    }, 100);
    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-sync').length).toBe(1);
    }, 100);
  });

  it('should support visibilityToggle(boolean)', async () => {
    const wrapper = mount(Input.Password, { props: { visibilityToggle: false }, sync: false });
    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-eye').length).toBe(0);
    }, 100);
  });

  it('should support visible', async () => {
    const cbMock = jest.fn();
    const wrapper = mount({
      render() {
        return <Password {...{ 'onUpdate:visible': cbMock }} visible="false"></Password>;
      },
    });

    await asyncExpect(() => {
      expect(wrapper.findAll('.anticon-eye').length).toBe(1);
    }, 100);

    await asyncExpect(() => {
      wrapper.find('.anticon-eye').trigger('click');
    }, 100);

    expect(cbMock).toHaveBeenCalledWith(false);
  });
});
