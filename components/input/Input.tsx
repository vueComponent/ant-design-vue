import type { VNode } from 'vue';
import { defineComponent, inject, nextTick, withDirectives } from 'vue';
import antInputDirective from '../_util/antInputDirective';
import classNames from '../_util/classNames';
import inputProps from './inputProps';
import { hasProp, getComponent, getOptionProps } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import ClearableLabeledInput from './ClearableLabeledInput';
import { useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';

export function fixControlledValue(value: string | number) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

export function resolveOnChange(target: HTMLInputElement, e: Event, onChange?: Function) {
  if (onChange) {
    const event = e as any;
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

export function getInputClassName(prefixCls: string, size: string, disabled: boolean) {
  return classNames(prefixCls, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-disabled`]: disabled,
  });
}

export default defineComponent({
  name: 'AInput',
  inheritAttrs: false,
  props: {
    ...inputProps,
  },
  setup() {
    const formItemContext = useInjectFormItemContext();
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      removePasswordTimeout: undefined,
      input: null,
      clearableInput: null,
      formItemContext,
    };
  },
  data() {
    const props = this.$props;
    const value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
    return {
      stateValue: typeof value === 'undefined' ? '' : value,
      isFocused: false,
    };
  },
  watch: {
    value(val) {
      this.stateValue = val;
    },
  },
  mounted() {
    nextTick(() => {
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
    handleInputFocus(e: Event) {
      this.isFocused = true;
      this.onFocus && this.onFocus(e);
    },

    handleInputBlur(e: Event) {
      this.isFocused = false;
      this.onBlur && this.onBlur(e);
      this.formItemContext.onFieldBlur();
    },

    focus() {
      this.input.focus();
    },

    blur() {
      this.input.blur();
    },
    select() {
      this.input.select();
    },

    saveClearableInput(input: HTMLInputElement) {
      this.clearableInput = input;
    },

    saveInput(input: HTMLInputElement) {
      this.input = input;
    },

    setValue(value: string | number, callback?: Function) {
      if (this.stateValue === value) {
        return;
      }
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
      } else {
        (this as any).$forceUpdate();
      }
      nextTick(() => {
        callback && callback();
      });
    },
    triggerChange(e: Event) {
      this.$emit('update:value', (e.target as HTMLInputElement).value);
      this.$emit('change', e);
      this.$emit('input', e);
      this.formItemContext.onFieldChange();
    },
    handleReset(e: Event) {
      this.setValue('', () => {
        this.focus();
      });
      resolveOnChange(this.input, e, this.triggerChange);
    },
    renderInput(prefixCls: string, { addonBefore, addonAfter }) {
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
        'inputPrefixCls',
        'loading',
      ]);
      const {
        handleKeyDown,
        handleChange,
        handleInputFocus,
        handleInputBlur,
        size,
        disabled,
        $attrs,
      } = this;

      const inputProps: any = {
        ...otherProps,
        ...$attrs,
        id: otherProps.id ?? this.formItemContext.id.value,
        onKeydown: handleKeyDown,
        class: classNames(getInputClassName(prefixCls, size, disabled), {
          [$attrs.class as string]: $attrs.class && !addonBefore && !addonAfter,
        }),
        ref: this.saveInput,
        key: 'ant-input',
        onInput: handleChange,
        onChange: handleChange,
        onFocus: handleInputFocus,
        onBlur: handleInputBlur,
      };
      if (!inputProps.autofocus) {
        delete inputProps.autofocus;
      }
      const inputNode = <input {...inputProps} />;
      return withDirectives(inputNode as VNode, [[antInputDirective]]);
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
    handleChange(e: Event) {
      const { value, composing, isComposing } = e.target as any;
      // https://github.com/vueComponent/ant-design-vue/issues/2203
      if (((isComposing || composing) && this.lazy) || this.stateValue === value) return;
      this.setValue(value, this.clearPasswordValueAttribute);
      resolveOnChange(this.input, e, this.triggerChange);
    },
    handleKeyDown(e: KeyboardEvent) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
  },
  render() {
    const { prefixCls: customizePrefixCls } = this.$props;
    const { stateValue, isFocused } = this.$data;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('input', customizePrefixCls);
    const addonAfter = getComponent(this, 'addonAfter');
    const addonBefore = getComponent(this, 'addonBefore');
    const suffix = getComponent(this, 'suffix');
    const prefix = getComponent(this, 'prefix');
    const props: any = {
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
      isFocused,
    };

    return <ClearableLabeledInput {...props} ref={this.saveClearableInput} />;
  },
});
