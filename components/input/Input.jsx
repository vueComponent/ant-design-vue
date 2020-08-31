import { inject } from 'vue';
import classNames from '../_util/classNames';
import omit from 'omit.js';
import inputProps from './inputProps';
import { hasProp, getComponent, getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import ClearableLabeledInput from './ClearableLabeledInput';
import syncWatch from '../_util/syncWatch';

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
  props: {
    ...inputProps,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  data() {
    const props = this.$props;
    const value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
    return {
      stateValue: typeof value === 'undefined' ? '' : value,
    };
  },
  watch: {
    value: syncWatch(function(val) {
      this.stateValue = val;
    }),
  },
  mounted() {
    this.$nextTick(() => {
      if (process.env.NODE_ENV === 'test') {
        if (this.autofocus) {
          this.focus();
        }
      }
      this.clearPasswordValueAttribute();
    });
  },
  beforeUnmount() {
    if (this.removePasswordTimeout) {
      clearTimeout(this.removePasswordTimeout);
    }
  },
  methods: {
    focus() {
      this.input.focus();
    },

    blur() {
      this.input.blur();
    },
    select() {
      this.input.select();
    },

    saveClearableInput(input) {
      this.clearableInput = input;
    },

    saveInput(input) {
      this.input = input;
    },

    setValue(value, callback) {
      if (this.stateValue === value) {
        return;
      }
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
      } else {
        this.$forceUpdate();
      }
      this.$nextTick(() => {
        callback && callback();
      });
    },
    triggerChange(e) {
      this.$emit('update:value', e.target.value);
      this.$emit('change', e);
      this.$emit('input', e);
    },
    handleReset(e) {
      this.setValue('', () => {
        this.focus();
      });
      resolveOnChange(this.input, e, this.triggerChange);
    },
    renderInput(prefixCls, { addonBefore, addonAfter }) {
      const otherProps = omit(this.$props, [
        'prefixCls',
        'onPressEnter',
        'addonBefore',
        'addonAfter',
        'prefix',
        'suffix',
        'allowClear',
        'defaultValue',
        'lazy',
        'size',
        'inputType',
        'className',
        'inputPrefixCls',
        'loading',
      ]);
      const { handleKeyDown, handleChange, size, disabled, $attrs } = this;

      const inputProps = {
        ...otherProps,
        ...$attrs,
        onKeydown: handleKeyDown,
        class: classNames(getInputClassName(prefixCls, size, disabled), {
          [$attrs.class]: $attrs.class && !addonBefore && !addonAfter,
        }),
        ref: this.saveInput,
        key: 'ant-input',
        onInput: handleChange,
        onChange: handleChange,
      };
      if (!inputProps.autofocus) {
        delete inputProps.autofocus;
      }
      return <input {...inputProps} />;
    },
    clearPasswordValueAttribute() {
      // https://github.com/ant-design/ant-design/issues/20541
      this.removePasswordTimeout = setTimeout(() => {
        if (
          this.input &&
          this.input.getAttribute &&
          this.input.getAttribute('type') === 'password' &&
          this.input.hasAttribute('value')
        ) {
          this.input.removeAttribute('value');
        }
      });
    },
    handleChange(e) {
      const { value, composing } = e.target;
      // https://github.com/vueComponent/ant-design-vue/issues/2203
      if (((e.isComposing || composing) && this.lazy) || this.stateValue === value) return;
      this.setValue(value, this.clearPasswordValueAttribute);
      resolveOnChange(this.input, e, this.triggerChange);
    },
    handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
  },
  render() {
    // if (this.$props.type === 'textarea') {
    //   const textareaProps = {
    //     ...this.$props,
    //     ...this.$attrs,
    //     onInput: this.handleChange,
    //     onKeydown: this.handleKeyDown,
    //     onChange: noop,
    //   };
    //   return <TextArea {...textareaProps} ref="input" />;
    // }
    const { prefixCls: customizePrefixCls } = this.$props;
    const { stateValue } = this.$data;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input', customizePrefixCls);
    const addonAfter = getComponent(this, 'addonAfter');
    const addonBefore = getComponent(this, 'addonBefore');
    const suffix = getComponent(this, 'suffix');
    const prefix = getComponent(this, 'prefix');
    const props = {
      ...this.$attrs,
      ...getOptionProps(this),
      prefixCls,
      inputType: 'input',
      value: fixControlledValue(stateValue),
      element: this.renderInput(prefixCls, { addonAfter, addonBefore }),
      handleReset: this.handleReset,
      addonAfter,
      addonBefore,
      suffix,
      prefix,
    };
    return <ClearableLabeledInput {...props} ref={this.saveClearableInput} />;
  },
};
