import { provide, inject, nextTick } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import Radio from './Radio';
import { getOptionProps, filterEmpty, hasProp, getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ARadioGroup',
  props: {
    prefixCls: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    size: {
      default: 'default',
      validator(value) {
        return ['large', 'default', 'small'].includes(value);
      },
    },
    options: {
      default: () => [],
      type: Array,
    },
    disabled: Boolean,
    name: String,
    buttonStyle: PropTypes.string.def('outline'),
    onChange: PropTypes.func,
  },
  data() {
    const { value, defaultValue } = this;
    this.updatingValue = false;
    return {
      stateValue: value === undefined ? defaultValue : value,
    };
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  computed: {
    radioOptions() {
      const { disabled } = this;
      return this.options.map(option => {
        return typeof option === 'string'
          ? { label: option, value: option }
          : { ...option, disabled: option.disabled === undefined ? disabled : option.disabled };
      });
    },
  },
  watch: {
    value(val) {
      this.updatingValue = false;
      this.stateValue = val;
    },
  },
  created() {
    this.radioGroupContext = provide('radioGroupContext', this);
  },
  methods: {
    onRadioChange(ev) {
      const lastValue = this.stateValue;
      const { value } = ev.target;
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
      }
      // nextTick for https://github.com/vueComponent/ant-design-vue/issues/1280
      if (!this.updatingValue && value !== lastValue) {
        this.updatingValue = true;
        this.$emit('update:value', value);
        this.$emit('change', ev);
      }
      nextTick(() => {
        this.updatingValue = false;
      });
    },
  },
  render() {
    const props = getOptionProps(this);
    const { prefixCls: customizePrefixCls, options, buttonStyle } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('radio', customizePrefixCls);

    const groupPrefixCls = `${prefixCls}-group`;
    const classString = classNames(groupPrefixCls, `${groupPrefixCls}-${buttonStyle}`, {
      [`${groupPrefixCls}-${props.size}`]: props.size,
    });

    let children = filterEmpty(getSlot(this));

    // 如果存在 options, 优先使用
    if (options && options.length > 0) {
      children = options.map(option => {
        if (typeof option === 'string') {
          return (
            <Radio
              key={option}
              prefixCls={prefixCls}
              disabled={props.disabled}
              value={option}
              checked={this.stateValue === option}
            >
              {option}
            </Radio>
          );
        }
        return (
          <Radio
            key={`radio-group-value-options-${option.value}`}
            prefixCls={prefixCls}
            disabled={option.disabled || props.disabled}
            value={option.value}
            checked={this.stateValue === option.value}
          >
            {option.label}
          </Radio>
        );
      });
    }

    return <div class={classString}>{children}</div>;
  },
};
