import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import VcCheckbox from '../vc-checkbox';
import classNames from 'classnames';
import { getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

function noop() {}

export default {
  name: 'ARadio',
  inheritAttrs: false,
  model: {
    prop: 'checked',
  },
  props: {
    prefixCls: PropTypes.string,
    defaultChecked: Boolean,
    checked: { type: Boolean, default: undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: PropTypes.any,
    name: String,
    id: String,
    autoFocus: Boolean,
    type: PropTypes.string.def('radio'),
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
      radioGroupContext: inject('radioGroupContext'),
    };
  },
  methods: {
    focus() {
      this.$refs.vcCheckbox.focus();
    },
    blur() {
      this.$refs.vcCheckbox.blur();
    },
    handleChange(event) {
      const targetChecked = event.target.checked;
      this.$emit('update:value', targetChecked);
      this.$emit('change', event);
    },
    onChange(e) {
      this.$emit('change', e);
      if (this.radioGroupContext && this.radioGroupContext.onRadioChange) {
        this.radioGroupContext.onRadioChange(e);
      }
    },
  },

  render() {
    const { $slots, radioGroupContext: radioGroup, $attrs } = this;
    const props = getOptionProps(this);
    const {
      onMouseenter = noop,
      onMouseleave = noop,
      class: className,
      style,
      ...restAttrs
    } = $attrs;
    const { prefixCls: customizePrefixCls, ...restProps } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('radio', customizePrefixCls);

    const radioProps = {
      prefixCls,
      ...restProps,
      ...restAttrs,
    };

    if (radioGroup) {
      radioProps.name = radioGroup.name;
      radioProps.onChange = this.onChange;
      radioProps.checked = props.value === radioGroup.stateValue;
      radioProps.disabled = props.disabled || radioGroup.disabled;
    } else {
      radioProps.onChange = this.handleChange;
    }
    const wrapperClassString = classNames(className, {
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: radioProps.checked,
      [`${prefixCls}-wrapper-disabled`]: radioProps.disabled,
    });

    return (
      <label
        class={wrapperClassString}
        style={style}
        onMouseenter={onMouseenter}
        onMouseleave={onMouseleave}
      >
        <VcCheckbox {...radioProps} ref="vcCheckbox" />
        {$slots.default !== undefined ? <span>{$slots.default()}</span> : null}
      </label>
    );
  },
};
