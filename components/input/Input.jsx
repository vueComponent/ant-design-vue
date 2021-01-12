import classNames from 'classnames';
import TextArea from './TextArea';
import omit from 'omit.js';
import inputProps from './inputProps';
import { hasProp, getComponentFromProp, getListeners, getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import ClearableLabeledInput from './ClearableLabeledInput';

function noop() {}

export function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

export function resolveOnChange(target, e, onChange) {
  if (onChange) {
    let event = e;
    if (e.type === 'click') {
      // click clear icon
      //event = Object.create(e);
      Object.defineProperty(event, 'target', {
        writable: true,
      });
      Object.defineProperty(event, 'currentTarget', {
        writable: true,
      });
      event.target = target;
      event.currentTarget = target;
      const originalInputValue = target.value;
      // change target ref value cause e.target.value should be '' when clear input
      target.value = '';
      onChange(event);
      // reset target ref value
      target.value = originalInputValue;
      return;
    }
    onChange(event);
  }
}

export function getInputClassName(prefixCls, size, disabled) {
  return classNames(prefixCls, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-disabled`]: disabled,
  });
}

export default {
  name: 'AInput',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: {
    ...inputProps,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    const props = this.$props;
    const value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
    return {
      stateValue: typeof value === 'undefined' ? '' : value,
    };
  },
  watch: {
    value(val) {
      this.stateValue = val;
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.autoFocus) {
        this.focus();
      }
      this.clearPasswordValueAttribute();
    });
  },
  beforeDestroy() {
    if (this.removePasswordTimeout) {
      clearTimeout(this.removePasswordTimeout);
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },

    blur() {
      this.$refs.input.blur();
    },
    select() {
      this.$refs.input.select();
    },

    setValue(value, callback) {
      if (this.stateValue === value) {
        return;
      }
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
        this.$nextTick(() => {
          callback && callback();
        });
      } else {
        // 不在严格受控
        // https://github.com/vueComponent/ant-design-vue/issues/2207，modal 是 新 new 实例，更新队列和当前不在同一个更新队列中
        // this.$forceUpdate();
      }
    },
    onChange(e) {
      this.$emit('change.value', e.target.value);
      this.$emit('change', e);
      this.$emit('input', e);
    },
    handleReset(e) {
      this.setValue('', () => {
        this.focus();
      });
      resolveOnChange(this.$refs.input, e, this.onChange);
    },
    renderInput(prefixCls) {
      const otherProps = omit(this.$props, [
        'prefixCls',
        'addonBefore',
        'addonAfter',
        'prefix',
        'suffix',
        'allowClear',
        'value',
        'defaultValue',
        'lazy',
        'size',
        'inputType',
        'className',
      ]);
      const { stateValue, handleKeyDown, handleChange, size, disabled } = this;
      const inputProps = {
        directives: [{ name: 'ant-input' }],
        domProps: {
          value: fixControlledValue(stateValue),
        },
        attrs: { ...otherProps, ...this.$attrs },
        on: {
          ...getListeners(this),
          keydown: handleKeyDown,
          input: handleChange,
          change: noop,
        },
        class: getInputClassName(prefixCls, size, disabled),
        ref: 'input',
        key: 'ant-input',
      };
      return <input {...inputProps} />;
    },
    clearPasswordValueAttribute() {
      // https://github.com/ant-design/ant-design/issues/20541
      this.removePasswordTimeout = setTimeout(() => {
        if (
          this.$refs.input &&
          this.$refs.input.getAttribute &&
          this.$refs.input.getAttribute('type') === 'password' &&
          this.$refs.input.hasAttribute('value')
        ) {
          this.$refs.input.removeAttribute('value');
        }
      });
    },
    handleChange(e) {
      const { value, composing } = e.target;
      // https://github.com/vueComponent/ant-design-vue/issues/2203
      if (((e.isComposing || composing) && this.lazy) || this.stateValue === value) return;
      this.setValue(value, this.clearPasswordValueAttribute);
      resolveOnChange(this.$refs.input, e, this.onChange);
    },
    handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
  },
  render() {
    if (this.$props.type === 'textarea') {
      const textareaProps = {
        props: this.$props,
        attrs: this.$attrs,
        on: {
          ...getListeners(this),
          input: this.handleChange,
          keydown: this.handleKeyDown,
          change: noop,
        },
      };
      return <TextArea {...textareaProps} ref="input" />;
    }
    const { prefixCls: customizePrefixCls } = this.$props;
    const { stateValue } = this.$data;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input', customizePrefixCls);
    const addonAfter = getComponentFromProp(this, 'addonAfter');
    const addonBefore = getComponentFromProp(this, 'addonBefore');
    const suffix = getComponentFromProp(this, 'suffix');
    const prefix = getComponentFromProp(this, 'prefix');
    const props = {
      props: {
        ...getOptionProps(this),
        prefixCls,
        inputType: 'input',
        value: fixControlledValue(stateValue),
        element: this.renderInput(prefixCls),
        handleReset: this.handleReset,
        addonAfter,
        addonBefore,
        suffix,
        prefix,
      },
      on: getListeners(this),
    };
    return <ClearableLabeledInput {...props} />;
  },
};
