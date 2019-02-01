import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import Radio from './Radio';
import { getOptionProps, filterEmpty, hasProp } from '../_util/props-util';
function noop() {}

export default {
  name: 'ARadioGroup',
  model: {
    prop: 'value',
  },
  props: {
    prefixCls: {
      default: 'ant-radio',
      type: String,
    },
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
  },
  data() {
    const { value, defaultValue } = this;
    return {
      stateValue: value === undefined ? defaultValue : value,
    };
  },
  provide() {
    return {
      radioGroupContext: this,
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
    classes() {
      const { prefixCls, size } = this;
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${size}`]: size,
      };
    },
  },
  watch: {
    value(val) {
      this.stateValue = val;
    },
  },
  methods: {
    onRadioChange(ev) {
      const lastValue = this.stateValue;
      const { value } = ev.target;
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
      }
      if (value !== lastValue) {
        this.$emit('input', value);
        this.$emit('change', ev);
      }
    },
  },
  render() {
    const { mouseenter = noop, mouseleave = noop } = this.$listeners;
    const props = getOptionProps(this);
    const { prefixCls, options, buttonStyle } = props;
    const groupPrefixCls = `${prefixCls}-group`;
    const classString = classNames(groupPrefixCls, `${groupPrefixCls}-${buttonStyle}`, {
      [`${groupPrefixCls}-${props.size}`]: props.size,
    });

    let children = filterEmpty(this.$slots.default);

    // 如果存在 options, 优先使用
    if (options && options.length > 0) {
      children = options.map((option, index) => {
        if (typeof option === 'string') {
          return (
            <Radio
              key={index}
              prefixCls={prefixCls}
              disabled={props.disabled}
              value={option}
              onChange={this.onRadioChange}
              checked={this.stateValue === option}
            >
              {option}
            </Radio>
          );
        } else {
          return (
            <Radio
              key={index}
              prefixCls={prefixCls}
              disabled={option.disabled || props.disabled}
              value={option.value}
              onChange={this.onRadioChange}
              checked={this.stateValue === option.value}
            >
              {option.label}
            </Radio>
          );
        }
      });
    }

    return (
      <div class={classString} onMouseenter={mouseenter} onMouseleave={mouseleave}>
        {children}
      </div>
    );
  },
};
