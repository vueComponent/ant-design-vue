import Form from '..';
import mountTest from '../../../tests/shared/mountTest';
import { mount } from '@vue/test-utils';
import { nextTick, ref, reactive, h } from 'vue';
import { asyncExpect, sleep } from '../../../tests/utils';
import { resetWarned } from '../../_util/warning';

const { Item } = Form;

const SimpleInput = (props, { emit }) => {
  return h('input', {
    value: props.value,
    class: 'ant-input',
    onInput: e => emit('update:value', e.target.value),
    onBlur: () => emit('blur'),
  });
};
SimpleInput.props = ['value'];
SimpleInput.emits = ['update:value', 'blur'];

describe('Form', () => {
  mountTest(Form);
  mountTest(Item);

  describe('基础渲染', () => {
    it('渲染基础表单正确', () => {
      const wrapper = mount({
        render() {
          return (
            <Form>
              <Item>
                <SimpleInput />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('layout 属性正确渲染', () => {
      const wrapper = mount({
        render() {
          return (
            <div>
              <Form layout="horizontal">
                <Item>
                  <SimpleInput />
                </Item>
              </Form>
              <Form layout="vertical">
                <Item>
                  <SimpleInput />
                </Item>
              </Form>
              <Form layout="inline">
                <Item>
                  <SimpleInput />
                </Item>
              </Form>
            </div>
          );
        },
      });
      expect(wrapper.find('.ant-form-horizontal').exists()).toBe(true);
      expect(wrapper.find('.ant-form-vertical').exists()).toBe(true);
      expect(wrapper.find('.ant-form-inline').exists()).toBe(true);
    });

    it('size 属性正确渲染', () => {
      const wrapper = mount({
        render() {
          return (
            <div>
              <Form size="small">
                <Item>
                  <SimpleInput />
                </Item>
              </Form>
              <Form size="large">
                <Item>
                  <SimpleInput />
                </Item>
              </Form>
            </div>
          );
        },
      });
      expect(wrapper.find('.ant-form-small').exists()).toBe(true);
      expect(wrapper.find('.ant-form-large').exists()).toBe(true);
    });

    it('hideRequiredMark 隐藏必填标记', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model} hideRequiredMark>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-hide-required-mark').exists()).toBe(true);
    });

    it('colon 设置为 false 时不显示冒号', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model} colon={false}>
              <Item label="名称" name="name">
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-no-colon').exists()).toBe(true);
    });
  });

  describe('表单验证', () => {
    it('required 必填验证', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      await asyncExpect(async () => {
        await wrapper.vm.$refs.form.validate();
      }, 100);

      await asyncExpect(() => {
        expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
      }, 200);
    });

    it('rules 自定义规则验证', async () => {
      const onFinishFailed = jest.fn();
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          const rules = {
            name: [{ required: true, message: '请输入名称' }],
          };
          return { model, rules };
        },
        render() {
          return (
            <Form ref="form" model={this.model} rules={this.rules} onFinishFailed={onFinishFailed}>
              <Item label="名称" name="name">
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.$refs.form.validateFields();
      } catch (e) {
        expect(e.errorFields.length).toBeGreaterThan(0);
      }
    });

    it('FormItem 单独设置 rules 验证', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ email: '' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item
                label="邮箱"
                name="email"
                rules={[
                  { type: 'email', message: '邮箱格式不正确' },
                  { required: true, message: '请输入邮箱' },
                ]}
              >
                <SimpleInput value={this.model.email} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.$refs.form.validateFields();
      } catch (e) {
        expect(e.errorFields.length).toBeGreaterThan(0);
      }
    });

    it('validateFirst 验证第一个错误后停止', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item
                label="名称"
                name="name"
                validateFirst
                rules={[
                  { required: true, message: '必填' },
                  { min: 5, message: '最少5个字符' },
                ]}
              >
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.$refs.form.validateFields();
      } catch (e) {
        expect(e.errorFields[0].errors.length).toBe(1);
      }
    });

    it('验证成功回调 onFinish', async () => {
      const onFinish = jest.fn();
      const wrapper = mount({
        setup() {
          const model = ref({ name: 'test' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model} onFinish={onFinish}>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      await wrapper.find('form').trigger('submit');
      await sleep(100);
      expect(onFinish).toHaveBeenCalled();
    });

    it('验证失败回调 onFinishFailed', async () => {
      const onFinishFailed = jest.fn();
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model} onFinishFailed={onFinishFailed}>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      await wrapper.find('form').trigger('submit');
      await sleep(100);
      expect(onFinishFailed).toHaveBeenCalled();
    });

    it('onValidate 验证回调', async () => {
      const onValidate = jest.fn();
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model} onValidate={onValidate}>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      await wrapper.vm.$refs.form.validateFields();
      await sleep(200);
      expect(onValidate).toHaveBeenCalled();
    });
  });

  describe('表单操作方法', () => {
    it('validateFields 验证指定字段', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '', email: 'test@example.com' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
              <Item label="邮箱" name="email" required>
                <SimpleInput value={this.model.email} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.$refs.form.validateFields(['email']);
      } catch (e) {
        expect(e.errorFields.length).toBe(0);
      }
    });

    it('getFieldsValue 获取所有字段值', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: 'test', email: 'test@example.com' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="名称" name="name">
                <SimpleInput value={this.model.name} />
              </Item>
              <Item label="邮箱" name="email">
                <SimpleInput value={this.model.email} />
              </Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = wrapper.vm.$refs.form.getFieldsValue();
      expect(values).toEqual({ name: 'test', email: 'test@example.com' });
    });

    it('resetFields 重置字段', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: 'initial' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="名称" name="name">
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      wrapper.vm.model.name = 'changed';
      await nextTick();
      expect(wrapper.vm.model.name).toBe('changed');

      wrapper.vm.$refs.form.resetFields();
      await nextTick();
      expect(wrapper.vm.model.name).toBe('initial');
    });

    it('clearValidate 清除验证状态', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.$refs.form.validateFields();
      } catch (e) {}

      await sleep(200);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);

      wrapper.vm.$refs.form.clearValidate();
      await sleep(200);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(false);
    });

    it('validate 别名方法', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: 'test' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      const result = await wrapper.vm.$refs.form.validate();
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('FormItem 功能', () => {
    it('label 正确显示', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model}>
              <Item label="测试标签" name="name">
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-label').text()).toContain('测试标签');
    });

    it('labelAlign 对齐方式', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model} labelAlign="left">
              <Item label="右对齐" name="name" labelAlign="right">
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-label').classes()).toContain('ant-form-item-label-right');
    });

    it('labelCol 和 wrapperCol 设置', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <Item label="测试" name="name" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-col-6').exists()).toBe(true);
      expect(wrapper.find('.ant-col-18').exists()).toBe(true);
    });

    it('required 必填样式显示', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model}>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-required').exists()).toBe(true);
    });

    it('hasFeedback 显示反馈图标', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="名称" name="name" required hasFeedback>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.$refs.form.validateFields();
      } catch (e) {}

      await sleep(200);
      expect(wrapper.find('.ant-form-item-has-feedback').exists()).toBe(true);
    });

    it('validateStatus 自定义验证状态', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model}>
              <Item label="成功" name="success" validateStatus="success" hasFeedback>
                <SimpleInput value={this.model.success} />
              </Item>
              <Item label="警告" name="warning" validateStatus="warning" hasFeedback>
                <SimpleInput value={this.model.warning} />
              </Item>
              <Item label="错误" name="error" validateStatus="error" hasFeedback>
                <SimpleInput value={this.model.error} />
              </Item>
              <Item label="验证中" name="validating" validateStatus="validating" hasFeedback>
                <SimpleInput value={this.model.validating} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-has-success').exists()).toBe(true);
      expect(wrapper.find('.ant-form-item-has-warning').exists()).toBe(true);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
      expect(wrapper.find('.ant-form-item-is-validating').exists()).toBe(true);
    });

    it('help 自定义提示文字', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model}>
              <Item label="名称" name="name" help="这是自定义帮助信息">
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-explain').text()).toContain('这是自定义帮助信息');
    });

    it('extra 额外信息', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model}>
              <Item label="名称" name="name" extra="额外说明信息">
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-extra').text()).toContain('额外说明信息');
    });

    it('hidden 隐藏表单项', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model}>
              <Item label="名称" name="name" hidden>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item-hidden').exists()).toBe(true);
    });

    it('noStyle 无样式', () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form model={this.model}>
              <Item name="name" noStyle>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });
      expect(wrapper.find('.ant-form-item').exists()).toBe(false);
    });
  });

  describe('useForm Hook', () => {
    it('基本验证功能', async () => {
      const wrapper = mount({
        setup() {
          const modelRef = reactive({
            name: '',
            email: 'invalid-email',
          });

          const rulesRef = reactive({
            name: [{ required: true, message: '请输入名称' }],
            email: [{ type: 'email', message: '邮箱格式不正确' }],
          });

          const { validateInfos, validate } = Form.useForm(modelRef, rulesRef);

          return { modelRef, rulesRef, validateInfos, validate };
        },
        render() {
          return (
            <Form model={this.modelRef}>
              <Item label="名称" name="name" v-bind="this.validateInfos.name">
                <SimpleInput value={this.modelRef.name} />
              </Item>
              <Item label="邮箱" name="email" v-bind="this.validateInfos.email">
                <SimpleInput value={this.modelRef.email} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.validate();
      } catch (e) {
        expect(e.errorFields.length).toBe(2);
      }
    });

    it('resetFields 重置字段', async () => {
      const wrapper = mount({
        setup() {
          const modelRef = reactive({ name: 'initial' });
          const { validateInfos, resetFields } = Form.useForm(modelRef, {});
          return { modelRef, validateInfos, resetFields };
        },
        render() {
          return (
            <Form model={this.modelRef}>
              <Item label="名称" name="name" v-bind="this.validateInfos.name">
                <SimpleInput value={this.modelRef.name} />
              </Item>
            </Form>
          );
        },
      });

      wrapper.vm.modelRef.name = 'changed';
      await nextTick();
      expect(wrapper.vm.modelRef.name).toBe('changed');

      wrapper.vm.resetFields();
      await nextTick();
      expect(wrapper.vm.modelRef.name).toBe('initial');
    });

    it('clearValidate 清除验证状态', async () => {
      const wrapper = mount({
        setup() {
          const modelRef = reactive({ name: '' });
          const rulesRef = reactive({
            name: [{ required: true }],
          });
          const { validateInfos, validate, clearValidate } = Form.useForm(modelRef, rulesRef);
          return { modelRef, validateInfos, validate, clearValidate };
        },
        render() {
          return (
            <Form model={this.modelRef}>
              <Item label="名称" name="name" v-bind="this.validateInfos.name">
                <SimpleInput value={this.modelRef.name} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.validate();
      } catch (e) {}

      await sleep(100);
      expect(wrapper.vm.validateInfos.name.validateStatus).toBe('error');

      wrapper.vm.clearValidate();
      await nextTick();
      expect(wrapper.vm.validateInfos.name.validateStatus).toBe('');
    });

    it('mergeValidateInfo 合并验证信息', () => {
      const wrapper = mount({
        setup() {
          const modelRef = reactive({ name: '' });
          const { mergeValidateInfo } = Form.useForm(modelRef, {});
          return { mergeValidateInfo };
        },
        render() {
          return <div />;
        },
      });

      const result = wrapper.vm.mergeValidateInfo([
        { validateStatus: 'error', help: '错误1', required: true },
        { required: false },
      ]);
      expect(result.validateStatus).toBe('error');
      expect(result.required).toBe(true);
    });
  });

  describe('边界情况', () => {
    it('没有 model 时警告', () => {
      resetWarned();
      const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const wrapper = mount({
        render() {
          return (
            <Form ref="form">
              <Item name="name">
                <SimpleInput />
              </Item>
            </Form>
          );
        },
      });

      wrapper.vm.$refs.form.resetFields();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('model is required for resetFields to work.'),
      );
      warnSpy.mockRestore();
    });

    it('没有 name 的 FormItem 不参与验证', async () => {
      const onFinish = jest.fn();
      const wrapper = mount({
        setup() {
          const model = ref({});
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model} onFinish={onFinish}>
              <Item label="无name">
                <SimpleInput />
              </Item>
            </Form>
          );
        },
      });

      await wrapper.find('form').trigger('submit');
      await sleep(100);
      expect(onFinish).toHaveBeenCalled();
    });

    it('数组类型 name - 嵌套字段', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ user: { info: { name: '' } } });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="嵌套名称" name={['user', 'info', 'name']} required>
                <SimpleInput value={this.model.user.info.name} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.$refs.form.validateFields();
      } catch (e) {
        expect(e.errorFields.length).toBeGreaterThan(0);
      }
    });

    it('动态修改 rules 触发验证', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          const rules = ref({});
          return { model, rules };
        },
        render() {
          return (
            <Form ref="form" model={this.model} rules={this.rules} validateOnRuleChange>
              <Item label="名称" name="name">
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      wrapper.vm.rules = { name: [{ required: true }] };
      await sleep(200);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });

    it('autoLink=false 不自动关联验证', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="名称" name="name" required autoLink={false}>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      wrapper.vm.model.name = 'changed';
      await sleep(200);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(false);
    });

    it('空值验证边界', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: null, age: undefined });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
              <Item label="年龄" name="age" required>
                <SimpleInput value={this.model.age} />
              </Item>
            </Form>
          );
        },
      });

      try {
        await wrapper.vm.$refs.form.validateFields();
      } catch (e) {
        expect(e.errorFields.length).toBeGreaterThan(0);
      }
    });

    it('嵌套对象值获取正确', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({
            user: {
              name: 'test',
              contact: {
                email: 'test@example.com',
              },
            },
          });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model}>
              <Item label="用户名" name={['user', 'name']}>
                <SimpleInput value={this.model.user.name} />
              </Item>
              <Item label="邮箱" name={['user', 'contact', 'email']}>
                <SimpleInput value={this.model.user.contact.email} />
              </Item>
            </Form>
          );
        },
      });

      await nextTick();
      const values = wrapper.vm.$refs.form.getFieldsValue();
      expect(values.user.name).toBe('test');
      expect(values.user.contact.email).toBe('test@example.com');
    });

    it('validateTrigger 触发时机', async () => {
      const wrapper = mount({
        setup() {
          const model = ref({ name: '' });
          return { model };
        },
        render() {
          return (
            <Form ref="form" model={this.model} validateTrigger="blur">
              <Item label="名称" name="name" required>
                <SimpleInput value={this.model.name} />
              </Item>
            </Form>
          );
        },
      });

      wrapper.vm.model.name = '';
      await nextTick();
      await wrapper.find('input').trigger('blur');
      await sleep(200);
      expect(wrapper.find('.ant-form-item-has-error').exists()).toBe(true);
    });
  });
});
