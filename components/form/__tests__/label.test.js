import { mount } from '@vue/test-utils';
import Form from '..';
import { asyncExpect } from '@/tests/utils';

describe('Form', () => {
  // Mock of `querySelector`
  const originQuerySelector = HTMLElement.prototype.querySelector;
  HTMLElement.prototype.querySelector = function querySelector(str) {
    const match = str.match(/^\[id=('|")(.*)('|")]$/);
    const id = match && match[2];

    // Use origin logic
    if (id) {
      const [input] = this.getElementsByTagName('input');
      if (input && input.id === id) {
        return input;
      }
    }

    return originQuerySelector.call(this, str);
  };

  afterAll(() => {
    HTMLElement.prototype.querySelector = originQuerySelector;
  });
  it('should remove duplicated user input colon', () => {
    const wrapper = mount({
      render() {
        return (
          <Form>
            <Form.Item label="label:">input</Form.Item>
            <Form.Item label="label：">input</Form.Item>
          </Form>
        );
      },
    });
    expect(
      wrapper
        .findAll('.ant-form-item-label label')
        .at(0)
        .text(),
    ).not.toContain(':');
    expect(
      wrapper
        .findAll('.ant-form-item-label label')
        .at(1)
        .text(),
    ).not.toContain('：');
  });

  it('should not remove duplicated user input colon when props colon is false', () => {
    const wrapper = mount({
      render() {
        return (
          <Form>
            <Form.Item label="label:" colon={false}>
              input
            </Form.Item>
            <Form.Item label="label：" colon={false}>
              input
            </Form.Item>
          </Form>
        );
      },
    });
    expect(
      wrapper
        .findAll('.ant-form-item-label label')
        .at(0)
        .text(),
    ).toContain(':');
    expect(
      wrapper
        .findAll('.ant-form-item-label label')
        .at(1)
        .text(),
    ).toContain('：');
  });

  it('should not remove duplicated user input colon when layout is vertical', () => {
    const wrapper = mount({
      render() {
        return (
          <Form layout="vertical">
            <Form.Item label="label:">input</Form.Item>
            <Form.Item label="label：">input</Form.Item>
          </Form>
        );
      },
    });
    expect(
      wrapper
        .findAll('.ant-form-item-label label')
        .at(0)
        .text(),
    ).toContain(':');
    expect(
      wrapper
        .findAll('.ant-form-item-label label')
        .at(1)
        .text(),
    ).toContain('：');
  });

  it('should has dom with .ant-form-item-control-wrapper', () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const wrapper = mount({
      render() {
        return (
          <Form>
            <Form.Item {...{ props: { ...formItemLayout } }}>input</Form.Item>
            <Form.Item>input</Form.Item>
          </Form>
        );
      },
    });
    expect(wrapper.findAll('.ant-form-item-control-wrapper').length).toBe(2);
    expect(wrapper.findAll('.ant-form-item-control-wrapper.ant-col-14').length).toBe(1);
  });

  // https://github.com/ant-design/ant-design/issues/7351
  it('focus correct input when click label', async () => {
    const Form1 = Form.create()({
      render() {
        return (
          <Form>
            <Form.Item label="label 1">{this.form.getFieldDecorator('test')(<input />)}</Form.Item>
          </Form>
        );
      },
    });
    const Form2 = Form.create()({
      render() {
        return (
          <Form>
            <Form.Item label="label 2">{this.form.getFieldDecorator('test2')(<input />)}</Form.Item>
          </Form>
        );
      },
    });

    const wrapper = mount(
      {
        render() {
          return (
            <div>
              <Form1 />
              <Form2 />
            </div>
          );
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      wrapper
        .findAll({ name: 'AForm' })
        .at(0)
        .findAll('label')
        .at(0)
        .trigger('click');
    });
    await asyncExpect(() => {
      expect(
        wrapper
          .findAll({ name: 'AForm' })
          .at(0)
          .findAll('input')
          .at(0).element,
      ).toBe(document.activeElement);
    });
    await asyncExpect(() => {
      wrapper
        .findAll({ name: 'AForm' })
        .at(1)
        .findAll('label')
        .at(0)
        .trigger('click');
    });
    await asyncExpect(() => {
      expect(
        wrapper
          .findAll({ name: 'AForm' })
          .at(1)
          .findAll('input')
          .at(0).element,
      ).toBe(document.activeElement);
    });
  });

  // https://github.com/ant-design/ant-design/issues/7693
  it('should not throw error when is not a valid id', async () => {
    const Form1 = Form.create()({
      render() {
        return (
          <Form>
            <Form.Item label="label 1">
              {this.form.getFieldDecorator('member[0].name.firstname')(<input />)}
            </Form.Item>
          </Form>
        );
      },
    });

    const wrapper = mount(Form1, { sync: false, attachToDocument: true });
    await asyncExpect(() => {
      expect(() => {
        wrapper
          .find({ name: 'AForm' })
          .findAll('label')
          .at(0)
          .trigger('click');
      }).not.toThrow();
    });
    // 不合法id时，document.activeElement没有正确更新
    // await asyncExpect(() => {
    //   expect(wrapper.find({ name: 'AForm' }).findAll('input').at(0).element).toBe(document.activeElement)
    // }, 0)
  });
});
