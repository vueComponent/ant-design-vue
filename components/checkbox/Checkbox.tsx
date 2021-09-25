import type { ExtractPropTypes } from 'vue';
import { defineComponent, inject, nextTick } from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import VcCheckbox from '../vc-checkbox';
import hasProp, { getOptionProps, getSlot } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import warning from '../_util/warning';
import type { RadioChangeEvent } from '../radio/interface';
import type { EventHandler } from '../_util/EventInterface';
import { useInjectFormItemContext } from '../form/FormItemContext';
function noop() {}

export const checkboxProps = () => {
  return {
    prefixCls: PropTypes.string,
    defaultChecked: PropTypes.looseBool,
    checked: PropTypes.looseBool,
    disabled: PropTypes.looseBool,
    isGroup: PropTypes.looseBool,
    value: PropTypes.any,
    name: PropTypes.string,
    id: PropTypes.string,
    indeterminate: PropTypes.looseBool,
    type: PropTypes.string.def('checkbox'),
    autofocus: PropTypes.looseBool,
    onChange: PropTypes.func,
    'onUpdate:checked': PropTypes.func,
    skipGroup: PropTypes.looseBool,
  };
};

export type CheckboxProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxProps>>>;

export default defineComponent({
  name: 'ACheckbox',
  inheritAttrs: false,
  __ANT_CHECKBOX: true,
  props: checkboxProps(),
  emits: ['change', 'update:checked'],
  setup() {
    const formItemContext = useInjectFormItemContext();
    return {
      formItemContext,
      configProvider: inject('configProvider', defaultConfigProvider),
      checkboxGroupContext: inject('checkboxGroupContext', undefined),
    };
  },

  watch: {
    value(value, prevValue) {
      if (this.skipGroup) {
        return;
      }
      nextTick(() => {
        const { checkboxGroupContext: checkboxGroup = {} } = this;
        if (checkboxGroup.registerValue && checkboxGroup.cancelValue) {
          checkboxGroup.cancelValue(prevValue);
          checkboxGroup.registerValue(value);
        }
      });
    },
  },

  mounted() {
    const { value, checkboxGroupContext: checkboxGroup = {} } = this;
    if (checkboxGroup.registerValue) {
      checkboxGroup.registerValue(value);
    }

    warning(
      hasProp(this, 'checked') || this.checkboxGroupContext || !hasProp(this, 'value'),
      'Checkbox',
      '`value` is not validate prop, do you mean `checked`?',
    );
  },
  beforeUnmount() {
    const { value, checkboxGroupContext: checkboxGroup = {} } = this;
    if (checkboxGroup.cancelValue) {
      checkboxGroup.cancelValue(value);
    }
  },
  methods: {
    handleChange(event: RadioChangeEvent) {
      const targetChecked = event.target.checked;
      this.$emit('update:checked', targetChecked);
      // this.$emit('input', targetChecked);
      this.$emit('change', event);
    },
    focus() {
      (this.$refs.vcCheckbox as HTMLInputElement).focus();
    },
    blur() {
      (this.$refs.vcCheckbox as HTMLInputElement).blur();
    },
  },

  render() {
    const props = getOptionProps(this);
    const { checkboxGroupContext: checkboxGroup, $attrs } = this;
    const children = getSlot(this);
    const {
      indeterminate,
      prefixCls: customizePrefixCls,
      skipGroup,
      id = this.formItemContext.id.value,
      ...restProps
    } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('checkbox', customizePrefixCls);
    const {
      onMouseenter = noop,
      onMouseleave = noop,
      onInput,
      class: className,
      style,
      ...restAttrs
    } = $attrs;
    const checkboxProps: any = {
      ...restProps,
      id,
      prefixCls,
      ...restAttrs,
    };
    if (checkboxGroup && !skipGroup) {
      checkboxProps.onChange = (...args) => {
        this.$emit('change', ...args);
        this.formItemContext.onFieldChange();
        checkboxGroup.toggleOption({ label: children, value: props.value });
      };
      checkboxProps.name = checkboxGroup.name;
      checkboxProps.checked = checkboxGroup.sValue.indexOf(props.value) !== -1;
      checkboxProps.disabled = props.disabled || checkboxGroup.disabled;
      checkboxProps.indeterminate = indeterminate;
    } else {
      checkboxProps.onChange = this.handleChange;
    }
    const classString = classNames(
      {
        [`${prefixCls}-wrapper`]: true,
        [`${prefixCls}-wrapper-checked`]: checkboxProps.checked,
        [`${prefixCls}-wrapper-disabled`]: checkboxProps.disabled,
      },
      className,
    );
    const checkboxClass = classNames({
      [`${prefixCls}-indeterminate`]: indeterminate,
    });
    return (
      <label
        class={classString}
        style={style}
        onMouseenter={onMouseenter as EventHandler}
        onMouseleave={onMouseleave as EventHandler}
      >
        <VcCheckbox {...checkboxProps} class={checkboxClass} ref="vcCheckbox" />
        {children.length ? <span>{children}</span> : null}
      </label>
    );
  },
});
