import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import Radio from './Radio';
import { getOptionProps, filterEmpty, hasProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
function noop() {}

export default {
  name: 'ARadioGroup',
  model: {
    prop: 'value',
  },
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
  },
  data() {
    const { value, defaultValue } = this;
    this.updatingValue = false;
    return {
      stateValue: value === undefined ? defaultValue : value,
    };
  },
  provide() {
    return {
      radioGroupContext: this,
    };
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
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
      this.updatingValue = false;
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
      // nextTick for https://github.com/vueComponent/ant-design-vue/issues/1280
      if (!this.updatingValue && value !== lastValue) {
        this.updatingValue = true;
        this.$emit('input', value);
        this.$emit('change', ev);
      }
      this.$nextTick(() => {
        this.updatingValue = false;
      });
    },
  },
  render() {
    const { mouseenter = noop, mouseleave = noop } = getListeners(this);
    const props = getOptionProps(this);
    const { prefixCls: customizePrefixCls, options, buttonStyle } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('radio', customizePrefixCls);

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
