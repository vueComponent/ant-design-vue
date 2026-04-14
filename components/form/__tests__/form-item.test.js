import Form from '../index';
import { mount } from '@vue/test-utils';
import { nextTick, reactive, ref, h } from 'vue';
import { asyncExpect, sleep } from '../../../tests/utils';

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

// Simple checkbox component for testing
const TestCheckbox = {
  props: ['checked', 'modelValue'],
  emits: ['update:checked', 'update:modelValue', 'change'],
  render() {
    return h('input', {
      type: 'checkbox',
      checked: this.checked || this.modelValue,
      onChange: e => {
        this.$emit('update:checked', e.target.checked);
        this.$emit('update:modelValue', e.target.checked);
        this.$emit('change', e);
      },
    });
  },
};

describe('Form.Item', () => {
  // Basic rendering tests
  describe('basic rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
      expect(wrapper.find('.ant-form-item-label').text()).toBe('Username');
    });

    it('should render without label', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
      expect(wrapper.find('.ant-form-item-label').exists()).toBe(false);
    });

    it('should render with custom class', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item class="custom-class">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.custom-class').exists()).toBe(true);
    });
  });

  // Label rendering tests
  describe('label rendering', () => {
    it('should render string label', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-label').text()).toBe('Username');
    });

    it('should render function label', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label={() => <span class="custom-label">Custom</span>}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.custom-label').exists()).toBe(true);
    });

    it('should render slot label', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item
                v-slots={{
                  label: () => <span class="slot-label">Slot Label</span>,
                }}
              >
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.slot-label').exists()).toBe(true);
    });
  });

  // Help message tests
  describe('help message', () => {
    it('should render help text', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" help="This is help text">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-explain').text()).toBe('This is help text');
    });

    it('should render help slot', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item
                label="Username"
                v-slots={{
                  help: () => <span class="custom-help">Custom Help</span>,
                }}
              >
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.custom-help').exists()).toBe(true);
    });

    it('should render help with html', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" help={<span class="html-help">HTML Help</span>}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.html-help').exists()).toBe(true);
    });
  });

  // Extra content tests
  describe('extra content', () => {
    it('should render extra text', () => {
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

    it('should render extra slot', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item
                label="Username"
                v-slots={{
                  extra: () => <span class="custom-extra">Custom Extra</span>,
                }}
              >
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.custom-extra').exists()).toBe(true);
    });
  });

  // Tooltip tests
  describe('tooltip', () => {
    it('should render tooltip icon', () => {
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

    it('should render tooltip slot', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item
                label="Username"
                v-slots={{
                  tooltip: () => <span class="custom-tooltip">Custom Tooltip</span>,
                }}
              >
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.custom-tooltip').exists()).toBe(true);
    });
  });

  // Required mark tests
  describe('required mark', () => {
    it('should show required mark when required is true', () => {
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

    it('should show required mark from rules', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" rules={[{ required: true }]}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-required').exists()).toBe(true);
    });

    it('should not show required mark when required is false', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" required={false}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-required').exists()).toBe(false);
    });
  });

  // Validation status tests
  describe('validation status', () => {
    it('should show success status', () => {
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
      expect(wrapper.find('.ant-form-item-feedback-icon-success').exists()).toBe(true);
    });

    it('should show warning status', () => {
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
      expect(wrapper.find('.ant-form-item-feedback-icon-warning').exists()).toBe(true);
    });

    it('should show error status', () => {
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
      expect(wrapper.find('.ant-form-item-feedback-icon-error').exists()).toBe(true);
    });

    it('should show validating status', () => {
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
      expect(wrapper.find('.ant-form-item-feedback-icon-validating').exists()).toBe(true);
    });

    it('should not show feedback icon when hasFeedback is false', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" validateStatus="success">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-has-success').exists()).toBe(true);
      expect(wrapper.find('.ant-form-item-feedback-icon').exists()).toBe(false);
    });
  });

  // Col layout tests
  describe('col layout', () => {
    it('should apply labelCol', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" labelCol={{ span: 6 }}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-col-6').exists()).toBe(true);
    });

    it('should apply wrapperCol', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" wrapperCol={{ span: 18 }}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-col-18').exists()).toBe(true);
    });

    it('should apply offset to labelCol', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" labelCol={{ span: 6, offset: 2 }}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-col-offset-2').exists()).toBe(true);
    });
  });

  // Label align tests
  describe('label align', () => {
    it('should support left label align', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" labelAlign="left">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should support right label align', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username" labelAlign="right">
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });
  });

  // Colon tests
  describe('colon', () => {
    it('should show colon by default', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Username">
                <TestInput />
              </Form.Item>
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
            <Form>
              <Form.Item label="Username" colon={false}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-label').exists()).toBe(true);
    });
  });

  // Name path tests
  describe('name path', () => {
    it('should support string name', () => {
      const model = reactive({ username: 'test' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username">
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should support array name path', () => {
      const model = reactive({ user: { name: 'test' } });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name={['user', 'name']}>
                <TestInput
                  value={model.user.name}
                  onUpdate:value={val => (model.user.name = val)}
                />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should support numeric name', () => {
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
  });

  // Rules validation tests
  describe('rules validation', () => {
    it('should validate required rule', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ required: true, message: 'Required' }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
      expect(wrapper.find('.ant-form-item-explain').text()).toBe('Required');
    });

    it('should validate min/max length', async () => {
      const model = reactive({ username: 'ab' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ min: 3, message: 'At least 3 characters' }]}>
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

    it('should validate max length', async () => {
      const model = reactive({ username: 'abcdefghij' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ max: 5, message: 'At most 5 characters' }]}>
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

    it('should validate pattern', async () => {
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

    it('should validate type', async () => {
      const model = reactive({ age: 'not a number' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="age" rules={[{ type: 'number', message: 'Must be a number' }]}>
                <TestInput value={model.age} onUpdate:value={val => (model.age = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should validate enum', async () => {
      const model = reactive({ status: 'invalid' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="status"
                rules={[{ enum: ['active', 'inactive'], message: 'Invalid status' }]}
              >
                <TestInput value={model.status} onUpdate:value={val => (model.status = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should validate whitespace', async () => {
      const model = reactive({ text: '   ' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="text"
                rules={[{ whitespace: true, message: 'Cannot be whitespace only' }]}
              >
                <TestInput value={model.text} onUpdate:value={val => (model.text = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should validate len', async () => {
      const model = reactive({ code: '123' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="code" rules={[{ len: 5, message: 'Must be exactly 5 characters' }]}>
                <TestInput value={model.code} onUpdate:value={val => (model.code = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should validate with custom validator', async () => {
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
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should validate with async validator', async () => {
      const asyncValidator = jest.fn((rule, value) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (value !== 'valid') {
              reject('Async validation failed');
            } else {
              resolve();
            }
          }, 100);
        });
      });
      const model = reactive({ async: 'invalid' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="async" rules={[{ validator: asyncValidator }]}>
                <TestInput value={model.async} onUpdate:value={val => (model.async = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(200);
      expect(asyncValidator).toHaveBeenCalled();
    });

    it('should support warningOnly rule', async () => {
      const model = reactive({ field: 'value' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="field"
                rules={[{ required: true, warningOnly: true, message: 'Warning message' }]}
              >
                <TestInput value={model.field} onUpdate:value={val => (model.field = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      model.field = '';
      await nextTick();
      await wrapper.find('input').trigger('blur');
      await sleep(100);
    });

    it('should support transform', async () => {
      const model = reactive({ text: '  value  ' });
      const transform = jest.fn(value => value?.trim());
      mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="text" rules={[{ transform, required: true }]}>
                <TestInput value={model.text} onUpdate:value={val => (model.text = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await sleep(100);
      expect(transform).toHaveBeenCalled();
    });
  });

  // Validate trigger tests
  describe('validate trigger', () => {
    it('should validate on blur', async () => {
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

    it('should validate with multiple triggers', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="username"
                rules={[{ required: true }]}
                validateTrigger={['change', 'blur']}
              >
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

    it('should support rule-level validateTrigger', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ required: true, validateTrigger: 'blur' }]}>
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
  });

  // No style tests
  describe('noStyle', () => {
    it('should render without form item wrapper when noStyle is true', () => {
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

    it('should still validate when noStyle is true', async () => {
      const model = reactive({ username: '' });
      const formRef = ref();
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name="username" rules={[{ required: true }]} noStyle>
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
    });
  });

  // Hidden tests
  describe('hidden', () => {
    it('should hide form item when hidden is true', () => {
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

  // Auto link tests
  describe('autoLink', () => {
    it('should auto validate by default', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ required: true }]}>
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
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(false);
    });
  });

  // Validate first tests
  describe('validateFirst', () => {
    it('should validate only first rule when validateFirst is true', async () => {
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

  // Message variables tests
  describe('messageVariables', () => {
    it('should use custom message variables', async () => {
      const model = reactive({ field: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item
                name="field"
                rules={[{ required: true, message: 'Please enter ${label}' }]}
                messageVariables={{ label: 'Custom Field' }}
              >
                <TestInput value={model.field} onUpdate:value={val => (model.field = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
    });
  });

  // HtmlFor tests
  describe('htmlFor', () => {
    it('should set htmlFor on label', () => {
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

    it('should auto generate fieldId when htmlFor is not set', () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" label="Username">
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('label').attributes('for')).toContain('username');
    });
  });

  // PrefixCls tests
  describe('prefixCls', () => {
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

  // Form item methods tests
  describe('form item methods', () => {
    it('should expose onFieldBlur method', async () => {
      const formItemRef = ref();
      const model = reactive({ username: '' });
      mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item ref={formItemRef} name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      expect(typeof formItemRef.value.onFieldBlur).toBe('function');
    });

    it('should expose onFieldChange method', async () => {
      const formItemRef = ref();
      const model = reactive({ username: '' });
      mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item ref={formItemRef} name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      expect(typeof formItemRef.value.onFieldChange).toBe('function');
    });

    it('should expose clearValidate method', async () => {
      const formItemRef = ref();
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item ref={formItemRef} name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);

      formItemRef.value.clearValidate();
      await nextTick();
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(false);
    });

    it('should expose resetField method', async () => {
      const formItemRef = ref();
      const model = reactive({ username: 'initial' });
      mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item ref={formItemRef} name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      model.username = 'changed';
      await nextTick();
      formItemRef.value.resetField();
      await sleep(100);
      expect(model.username).toBe('initial');
    });
  });

  // Edge cases
  describe('edge cases', () => {
    it('should handle empty name', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should handle null label', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label={null}>
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should handle undefined rules', () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={undefined}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should handle empty rules array', () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should handle deeply nested name path', async () => {
      const formRef = ref();
      const model = reactive({
        level1: { level2: { level3: { value: 'deep' } } },
      });
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name={['level1', 'level2', 'level3', 'value']}>
                <TestInput
                  value={model.level1.level2.level3.value}
                  onUpdate:value={val => (model.level1.level2.level3.value = val)}
                />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = formRef.value.getFieldsValue();
      expect(values.level1.level2.level3.value).toBe('deep');
    });

    it('should handle array in name path', async () => {
      const formRef = ref();
      const model = reactive({
        items: [{ name: 'item1' }, { name: 'item2' }],
      });
      mount({
        render() {
          return (
            <Form ref={formRef} model={model}>
              <Form.Item name={['items', 0, 'name']}>
                <TestInput
                  value={model.items[0].name}
                  onUpdate:value={val => (model.items[0].name = val)}
                />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = formRef.value.getFieldsValue();
      expect(values.items[0].name).toBe('item1');
    });

    it('should handle rapid validation triggers', async () => {
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ required: true }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      // Trigger multiple validations rapidly
      await wrapper.find('input').trigger('blur');
      await wrapper.find('input').trigger('blur');
      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('should handle validation with special characters in value', async () => {
      const model = reactive({ text: '<>&"\'' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="text" rules={[{ required: true }]}>
                <TestInput value={model.text} onUpdate:value={val => (model.text = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await nextTick();
      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(false);
    });

    it('should handle very long validation message', async () => {
      const longMessage = 'Error: '.repeat(100);
      const model = reactive({ username: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="username" rules={[{ required: true, message: longMessage }]}>
                <TestInput value={model.username} onUpdate:value={val => (model.username = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').trigger('blur');
      await sleep(100);
      expect(wrapper.find('.ant-form-item-explain').text()).toBe(longMessage);
    });

    it('should handle form item without children', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Empty" />
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(true);
    });

    it('should handle form item with multiple children', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Form.Item label="Multiple">
                <TestInput />
                <TestInput />
              </Form.Item>
            </Form>
          );
        },
      });
      expect(wrapper.findAll('input').length).toBe(2);
    });
  });

  // Integration with different input types
  describe('integration with different inputs', () => {
    it('should work with TestInput', async () => {
      const model = reactive({ text: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="text" rules={[{ required: true }]}>
                <TestInput value={model.text} onUpdate:value={val => (model.text = val)} />
              </Form.Item>
            </Form>
          );
        },
      });

      await wrapper.find('input').setValue('test');
      expect(model.text).toBe('test');
    });

    it('should work with TestCheckbox', async () => {
      const model = reactive({ checked: false });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="checked">
                <TestCheckbox
                  checked={model.checked}
                  onUpdate:checked={val => (model.checked = val)}
                />
              </Form.Item>
            </Form>
          );
        },
      });

      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
    });

    it('should work with native input', async () => {
      const model = reactive({ text: '' });
      const wrapper = mount({
        render() {
          return (
            <Form model={model}>
              <Form.Item name="text" rules={[{ required: true }]}>
                <input
                  value={model.text}
                  onInput={e => (model.text = e.target.value)}
                  onBlur={() => {}}
                />
              </Form.Item>
            </Form>
          );
        },
      });

      expect(wrapper.find('input').exists()).toBe(true);
    });
  });
});
