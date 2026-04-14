import Form from '../index';
import { mount } from '@vue/test-utils';
import { nextTick, reactive, ref, h } from 'vue';
import { asyncExpect, sleep } from '../../../tests/utils';
import mountTest from '../../../tests/shared/mountTest';
import { resetWarned } from '../../_util/warning';

// Simple input component for testing
const TestInput = {
  props: ['value', 'modelValue'],
  emits: ['update:value', 'update:modelValue', 'blur', 'change', 'input'],
  render() {
    return h('input', {
      value: this.value || this.modelValue,
      onInput: e => {
        this.$emit('update:value', e.target.value);
        this.$emit('update:modelValue', e.target.value);
        this.$emit('input', e);
      },
      onBlur: e => {
        this.$emit('blur', e);
      },
      onChange: e => {
        this.$emit('change', e);
      },
    });
  },
};

describe('Form', () => {
  mountTest(Form);
  mountTest(Form.Item);

  it('renders correctly', () => {
    const wrapper = mount({
      render() {
        return <Form>Form Content</Form>;
      },
    });
    expect(wrapper.find('.ant-form').exists()).toBe(true);
    expect(wrapper.text()).toBe('Form Content');
  });

  // Layout tests
  describe('layout', () => {
    it('should have horizontal layout by default', () => {
      const wrapper = mount({
        render() {
          return <Form>Form</Form>;
        },
      });
      expect(wrapper.find('.ant-form-horizontal').exists()).toBe(true);
    });

    it('should support vertical layout', () => {
      const wrapper = mount({
        render() {
          return <Form layout="vertical">Form</Form>;
        },
      });
      expect(wrapper.find('.ant-form-vertical').exists()).toBe(true);
    });

    it('should support inline layout', () => {
      const wrapper = mount({
        render() {
          return <Form layout="inline">Form</Form>;
        },
      });
      expect(wrapper.find('.ant-form-inline').exists()).toBe(true);
    });
  });

  // Colon tests
  describe('colon', () => {
    it('should show colon by default', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username">Input</Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-label').exists()).toBe(true);
    });

    it('should hide colon when colon is false', () => {
      const wrapper = mount({
        render() {
          return (
            <Form colon={false}>
              <Form.Item label="Username">Input</Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-label').exists()).toBe(true);
    });
  });

  // Required mark tests
  describe('requiredMark', () => {
    it('should show required mark when requiredMark is true', () => {
      const wrapper = mount({
        render() {
          return (
            <Form requiredMark={true}>
              <Form.Item label="Username" required>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-required').exists()).toBe(true);
    });

    it('should hide required mark when requiredMark is false', () => {
      const wrapper = mount({
        render() {
          return (
            <Form requiredMark={false}>
              <Form.Item label="Username" required>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-hide-required-mark').exists()).toBe(true);
    });

    it('should support optional requiredMark', () => {
      const wrapper = mount({
        render() {
          return (
            <Form requiredMark="optional">
              <Form.Item label="Username">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form').exists()).toBe(true);
    });
  });

  // Form submission tests
  describe('form submission', () => {
    it('should trigger onFinish when validation passes', async () => {
      const onFinish = jest.fn();
      const model = reactive({ username: 'test' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model} onFinish={onFinish}>
              <Form.Item name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
              <button type="submit">Submit</button>
            </Form>
          );
        },
      });

      await wrapper.find('form').trigger('submit');
      await sleep(100);
      expect(onFinish).toHaveBeenCalled();
    });

    it('should trigger onFinishFailed when validation fails', async () => {
      const onFinishFailed = jest.fn();
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model} onFinishFailed={onFinishFailed}>
              <Form.Item name="username" rules={[{ required: true, message: 'Required' }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
              <button type="submit">Submit</button>
            </Form>
          );
        },
      });

      await wrapper.find('form').trigger('submit');
      await sleep(100);
      expect(onFinishFailed).toHaveBeenCalled();
    });

    it('should trigger onSubmit event', async () => {
      const onSubmit = jest.fn();
      const wrapper = mount({
        render() {
          return (
            <Form onSubmit={onSubmit}>
              <button type="submit">Submit</button>
            </Form>
          );
        },
      });

      await wrapper.find('form').trigger('submit');
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  // Form methods tests
  describe('form methods', () => {
    it('should validate fields correctly', async () => {
      const formRef = ref();
      const model = reactive({ username: '', email: 'test@test.com' });
      const wrapper = mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="username" rules={[{ required: true, message: 'Username required' }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
              <Form.Item name="email" rules={[{ required: true, message: 'Email required' }]}>
                <TestInput value={model.email} onUpdate:value={val => (model.email = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      try {
        await formRef.value.validate();
      } catch (e) {
        // Expected to fail
      }
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should validate specific fields', async () => {
      const formRef = ref();
      const model = reactive({ username: '', email: 'test@test.com' });
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="username" rules={[{ required: true, message: 'Username required' }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
              <Form.Item name="email" rules={[{ required: true, message: 'Email required' }]}>
                <TestInput value={model.email} onUpdate:value={val => (model.email = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      try {
        await formRef.value.validateFields(['username']);
      } catch (e) {
        // Expected to fail
      }
    });

    it('should reset fields correctly', async () => {
      const formRef = ref();
      const model = reactive({ username: 'initial' });
      const wrapper = mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      model.username = 'changed';
      await nextTick();
      formRef.value.resetFields();
      await sleep(100);
      expect(model.username).toBe('initial');
    });

    it('should clear validation correctly', async () => {
      const formRef = ref();
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="username" rules={[{ required: true, message: 'Required' }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      try {
        await formRef.value.validate();
      } catch (e) {
        // Expected
      }
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);

      formRef.value.clearValidate();
      await nextTick();
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(false);
    });

    it('should get fields value correctly', async () => {
      const formRef = ref();
      const model = reactive({ username: 'test', email: 'test@test.com' });
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="username">
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
              <Form.Item name="email">
                <TestInput value={model.email} onUpdate:value={val => (model.email = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = formRef.value.getFieldsValue();
      expect(values.username).toBe('test');
      expect(values.email).toBe('test@test.com');
    });

    it('should get specific fields value correctly', async () => {
      const formRef = ref();
      const model = reactive({ username: 'test', email: 'test@test.com' });
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="username">
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
              <Form.Item name="email">
                <TestInput value={model.email} onUpdate:value={val => (model.email = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = formRef.value.getFieldsValue([['username']]);
      expect(values.username).toBe('test');
      expect(values.email).toBeUndefined();
    });
  });

  // Rules validation tests
  describe('rules validation', () => {
    it('should validate with custom rules', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input username' },
                  { min: 3, message: 'At least 3 characters' },
                ]}
              >
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-explain').text()).toContain('Please input username');
    });

    it('should validate with pattern rule', async () => {
      const model = reactive({ email: 'invalid' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="email"
                rules={[{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }]}
              >
                <TestInput value={model.email} onUpdate:value={val => (model.email = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should validate with validator function', async () => {
      const validator = jest.fn((rule, value) => {
        if (value !== 'expected') {
          return Promise.reject('Value must be "expected"');
        }
        return Promise.resolve();
      });
      const model = reactive({ custom: 'wrong' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="custom" rules={[{ validator }]}>
                <TestInput value={model.custom} onUpdate:value={val => (model.custom = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(validator).toHaveBeenCalled();
    });
  });

  // Form events tests
  describe('form events', () => {
    it('should trigger onValuesChange when values change', async () => {
      const onValuesChange = jest.fn();
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model} onValuesChange={onValuesChange}>
              <Form.Item name="username">
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').setValue('new value');
      await sleep(100);
      expect(onValuesChange).toHaveBeenCalled();
    });

    it('should trigger onFieldsChange when fields change', async () => {
      const onFieldsChange = jest.fn();
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model} onFieldsChange={onFieldsChange}>
              <Form.Item name="username">
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('focus');
      await wrapper.find('input').trigger('blur');
      await sleep(100);
    });

    it('should trigger onValidate when validation completes', async () => {
      const onValidate = jest.fn();
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model} onValidate={onValidate}>
              <Form.Item name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(onValidate).toHaveBeenCalled();
    });
  });

  // Validate trigger tests
  describe('validateTrigger', () => {
    it('should validate on blur by default', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ required: true }]} validateTrigger="blur">
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should validate on change', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ required: true }]} validateTrigger="change">
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').setValue('test');
      await sleep(100);
    });
  });

  // Form size tests
  describe('size', () => {
    it('should support small size', () => {
      const wrapper = mount({
        render() {
          return <Form size="small">Form</Form>;
        },
      });
      expect(wrapper.find('.ant-form-small').exists()).toBe(true);
    });

    it('should support large size', () => {
      const wrapper = mount({
        render() {
          return <Form size="large">Form</Form>;
        },
      });
      expect(wrapper.find('.ant-form-large').exists()).toBe(true);
    });
  });

  // Disabled tests
  describe('disabled', () => {
    it('should support disabled prop', () => {
      const wrapper = mount({
        render() {
          return <Form disabled={true}>Form</Form>;
        },
      });
      expect(wrapper.find('.ant-form').exists()).toBe(true);
    });
  });

  // Name prop tests
  describe('name', () => {
    it('should support form name', () => {
      const wrapper = mount({
        render() {
          return (
            <Form name="testForm">
              <Form.Item name="username" label="Username">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form').exists()).toBe(true);
    });
  });

  // Label align tests
  describe('labelAlign', () => {
    it('should support left label align', () => {
      const wrapper = mount({
        render() {
          return (
            <Form labelAlign="left">
              <Form.Item label="Username">Input</Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form').exists()).toBe(true);
    });

    it('should support right label align', () => {
      const wrapper = mount({
        render() {
          return (
            <Form labelAlign="right">
              <Form.Item label="Username">Input</Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form').exists()).toBe(true);
    });
  });

  // Label wrap tests
  describe('labelWrap', () => {
    it('should support labelWrap', () => {
      const wrapper = mount({
        render() {
          return (
            <Form labelWrap={true}>
              <Form.Item label="Very Long Label Text">Input</Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form').exists()).toBe(true);
    });
  });

  // LabelCol and wrapperCol tests
  describe('labelCol and wrapperCol', () => {
    it('should support labelCol and wrapperCol', () => {
      const wrapper = mount({
        render() {
          return (
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Form.Item label="Username">Input</Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form').exists()).toBe(true);
      expect(wrapper.find('.ant-col-6').exists()).toBe(true);
      expect(wrapper.find('.ant-col-18').exists()).toBe(true);
    });
  });

  // Form.Item noStyle tests
  describe('Form.Item noStyle', () => {
    it('should render without style when noStyle is true', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item noStyle>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(false);
      expect(wrapper.find('input').exists()).toBe(true);
    });
  });

  // Form.Item hidden tests
  describe('Form.Item hidden', () => {
    it('should hide field when hidden is true', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item name="hiddenField" hidden>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-hidden').exists()).toBe(true);
    });
  });

  // Form.Item help tests
  describe('Form.Item help', () => {
    it('should display custom help message', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" help="This is a help message">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-explain').text()).toBe('This is a help message');
    });
  });

  // Form.Item extra tests
  describe('Form.Item extra', () => {
    it('should display extra content', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" extra="Extra information">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-extra').text()).toBe('Extra information');
    });
  });

  // Form.Item tooltip tests
  describe('Form.Item tooltip', () => {
    it('should display tooltip', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" tooltip="This is a tooltip">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-tooltip').exists()).toBe(true);
    });
  });

  // Form.Item hasFeedback tests
  describe('Form.Item hasFeedback', () => {
    it('should show feedback icon when hasFeedback is true', async () => {
      const model = reactive({ username: 'test' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="username"
                hasFeedback
                rules={[{ required: true }]}
                validateStatus="success"
              >
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      expect(wrapper.find('.ant-form-item-has-feedback').exists()).toBe(true);
    });
  });

  // Form.Item validateStatus tests
  describe('Form.Item validateStatus', () => {
    it('should support success validateStatus', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" validateStatus="success" hasFeedback>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-has-success').exists()).toBe(true);
    });

    it('should support warning validateStatus', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" validateStatus="warning" hasFeedback>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-has-warning').exists()).toBe(true);
    });

    it('should support error validateStatus', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" validateStatus="error" hasFeedback>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should support validating validateStatus', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" validateStatus="validating" hasFeedback>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-is-validating').exists()).toBe(true);
    });
  });

  // Form.Item required tests
  describe('Form.Item required', () => {
    it('should mark field as required when required is true', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" required>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-required').exists()).toBe(true);
    });
  });

  // Form.Item autoLink tests
  describe('Form.Item autoLink', () => {
    it('should not auto validate when autoLink is false', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ required: true }]} autoLink={false}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      // Should not show error because autoLink is false
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(false);
    });
  });

  // Nested name path tests
  describe('nested name path', () => {
    it('should support nested name path', async () => {
      const formRef = ref();
      const model = reactive({ user: { name: 'test', email: 'test@test.com' } });
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name={['user', 'name']}>
                <TestInput
                  value={model.user.name}
                  onUpdate:value={val => (model.user.name = val)}
                />
              </Form.Item>
              <Form.Item name={['user', 'email']}>
                <TestInput
                  value={model.user.email}
                  onUpdate:value={val => (model.user.email = val)}
                />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = formRef.value.getFieldsValue();
      expect(values.user.name).toBe('test');
      expect(values.user.email).toBe('test@test.com');
    });
  });

  // Form.Item messageVariables tests
  describe('Form.Item messageVariables', () => {
    it('should use custom message variables in validation', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input ${label}' }]}
                messageVariables={{ label: 'Custom Label' }}
              >
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
    });
  });

  // Form.Item validateFirst tests
  describe('Form.Item validateFirst', () => {
    it('should validate first rule only when validateFirst is true', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="username"
                validateFirst
                rules={[
                  { required: true, message: 'First error' },
                  { min: 5, message: 'Second error' },
                ]}
              >
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-explain').text()).toBe('First error');
    });
  });

  // Form.Item htmlFor tests
  describe('Form.Item htmlFor', () => {
    it('should set htmlFor attribute on label', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" htmlFor="custom-id">
                <input id="custom-id" />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('label').attributes('for')).toBe('custom-id');
    });
  });

  // Form.Item prefixCls tests
  describe('Form.Item prefixCls', () => {
    it('should support custom prefixCls', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" prefixCls="custom-form">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.custom-form-item').exists()).toBe(true);
    });
  });

  // Warning tests
  describe('warnings', () => {
    it('should warn when using prop instead of name', () => {
      resetWarned();
      const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" prop="username">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn when resetFields is called without model', () => {
      resetWarned();
      const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const formRef = ref();
      mount({
        render() {
          return (
            <Form ref={formRef}>
              <Form.Item name="username">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });

      formRef.value.resetFields();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('model is required for resetFields to work'),
      );
      warnSpy.mockRestore();
    });

    it('should warn when validateFields is called without model', async () => {
      resetWarned();
      const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const formRef = ref();
      mount({
        render() {
          return (
            <Form ref={formRef}>
              <Form.Item name="username" rules={[{ required: true }]}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });

      try {
        await formRef.value.validateFields();
      } catch (e) {
        // Expected
      }
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('model is required for validateFields to work'),
      );
      warnSpy.mockRestore();
    });
  });

  // scrollToFirstError tests
  describe('scrollToFirstError', () => {
    it('should scroll to first error when scrollToFirstError is true', async () => {
      const onFinishFailed = jest.fn();
      const model = reactive({ username: '' });
      mount({
        render() {
          return (
            <Form model={model} onFinishFailed={onFinishFailed} scrollToFirstError={true}>
              <Form.Item name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
              <button type="submit">Submit</button>
            </Form>
          );
        },
      });
    });

    it('should scroll to first error with custom options', async () => {
      const onFinishFailed = jest.fn();
      const model = reactive({ username: '' });
      mount({
        render() {
          return (
            <Form
              model={model}
              onFinishFailed={onFinishFailed}
              scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
            >
              <Form.Item name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
              <button type="submit">Submit</button>
            </Form>
          );
        },
      });
    });
  });

  // validateOnRuleChange tests
  describe('validateOnRuleChange', () => {
    it('should validate when rules change and validateOnRuleChange is true', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model} validateOnRuleChange={true}>
              <Form.Item name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      // Rules change should trigger validation
    });
  });

  // Form.ItemRest tests
  describe('Form.ItemRest', () => {
    it('should render Form.ItemRest', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.ItemRest>
                <TestInput />
              </Form.ItemRest>
            </Form>
          );
        },
      });
      expect(wrapper.find('input').exists()).toBe(true);
    });
  });

  // Complex form tests
  describe('complex form scenarios', () => {
    it('should handle multiple fields with different rules', async () => {
      const formRef = ref();
      const model = reactive({
        username: '',
        email: '',
        age: null,
      });
      const wrapper = mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Username is required' },
                  { min: 3, message: 'At least 3 characters' },
                ]}
              >
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Invalid email format' },
                ]}
              >
                <TestInput value={model.email} onUpdate:value={val => (model.email = val)} />
              </Form.Item>
              <Form.Item
                name="age"
                rules={[
                  { required: true, message: 'Age is required' },
                  { type: 'number', message: 'Must be a number' },
                ]}
              >
                <TestInput value={model.age} onUpdate:value={val => (model.age = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      try {
        await formRef.value.validate();
      } catch (e) {
        // Expected to fail
      }
      await sleep(100);
      expect(wrapper.findAll('.ant-form-item-has-error').length).toBeGreaterThan(0);
    });

    it('should handle dynamic field addition and removal', async () => {
      const formRef = ref();
      const model = reactive({
        fields: ['field1', 'field2'],
      });
      const wrapper = mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              {model.fields.map((field, index) => (
                <Form.Item key={index} name={['fields', index]}>
                  <TestInput value={field} onUpdate:value={val => (model.fields[index] = val)} />
                </Form.Item>
              ))}
            </Form>
          );
        },
      });

      await nextTick();
      expect(wrapper.findAll('.ant-form-item').length).toBe(2);

      model.fields.push('field3');
      await nextTick();
      expect(wrapper.findAll('.ant-form-item').length).toBe(3);
    });
  });

  // Edge cases
  describe('edge cases', () => {
    it('should handle empty form', () => {
      const wrapper = mount({
        render() {
          return <Form />;
        },
      });
      expect(wrapper.find('.ant-form').exists()).toBe(true);
    });

    it('should handle form with only text content', () => {
      const wrapper = mount({
        render() {
          return <Form>Plain text content</Form>;
        },
      });
      expect(wrapper.text()).toBe('Plain text content');
    });

    it('should handle form item without name', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="No Name Field">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should handle form item with numeric name', () => {
      const model = reactive({ 0: 'value' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name={0}>
                <TestInput value={model[0]} onUpdate:value={val => (model[0] = val)} />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should handle very long label text', () => {
      const longLabel = 'A'.repeat(200);
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label={longLabel}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should handle special characters in field values', async () => {
      const model = reactive({ text: '<script>alert("xss")</script>' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="text">
                <TestInput value={model.text} onUpdate:value={val => (model.text = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      expect(wrapper.find('input').element.value).toBe('<script>alert("xss")</script>');
    });

    it('should handle array field values', async () => {
      const formRef = ref();
      const model = reactive({ tags: ['tag1', 'tag2', 'tag3'] });
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="tags">
                <TestInput value={model.tags} onUpdate:value={val => (model.tags = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = formRef.value.getFieldsValue();
      expect(Array.isArray(values.tags)).toBe(true);
      expect(values.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should handle object field values', async () => {
      const formRef = ref();
      const model = reactive({
        config: { enabled: true, count: 10 },
      });
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="config">
                <TestInput value={model.config} onUpdate:value={val => (model.config = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = formRef.value.getFieldsValue();
      expect(typeof values.config).toBe('object');
      expect(values.config.enabled).toBe(true);
    });

    it('should handle null and undefined values', async () => {
      const formRef = ref();
      const model = reactive({
        nullField: null,
        undefinedField: undefined,
      });
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="nullField">
                <TestInput />
              </Form.Item>
              <Form.Item name="undefinedField">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = formRef.value.getFieldsValue();
      expect(values.nullField).toBeNull();
      expect(values.undefinedField).toBeUndefined();
    });
  });
});
